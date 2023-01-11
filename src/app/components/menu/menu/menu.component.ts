import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { TranslateService } from '@ngx-translate/core';
import { NativeService } from '@services/native-services/native.service';
import { MessageThreadsService } from '@services/rest-api-services/message-threads.service';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { ConfigService } from '@services/state-services/config.service';
import { Utils } from '@services/util-services/util.service';
import { MenuItem, MenuModel } from '@app/types/model.type';
import { User } from '@app/types/user.type';
import { QuestionnaireSchedulesService } from '@services/rest-api-services/questionnaire-schedules.service';
import { VideoEnabledResponseMessage } from '@app/types/native.type';
import { VideoService } from '@services/video-services/video.service';
import { ThreadRef, ThreadsResult } from '@app/types/messages.type';
import { addWeeks } from 'date-fns';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from '@services/rest-api-services/notifications.service';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs';
import { QuestionnaireScheduleSummary } from '@app/types/questionnaire-schedules.type';
import { ClinicianService } from '@services/rest-api-services/clinician.service';
import { AuthenticationService } from '@services/rest-api-services/authentication.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent implements OnInit {
  model: MenuModel = {
    canChangePassword: false,
    menuItems: [],
  };
  user: User;
  isClinician = false;

  constructor(
    private appContext: StatePassingService,
    private config: ConfigService,
    private util: Utils,
    private router: Router,
    private translateService: TranslateService,
    private messageThreads: MessageThreadsService,
    private native: NativeService,
    private questionnaireSchedules: QuestionnaireSchedulesService,
    private videoService: VideoService,
    private idle: Idle,
    private notifications: NotificationsService,
    private clinicianService: ClinicianService,
    private authentication: AuthenticationService
  ) {
    this.user = this.appContext.getUser();
    this.isClinician = this.clinicianService.isClinician();
    this.appContext.requestParams.clearParam('useDefaultAuth'); // If clinician --> Use patient credentials from now on
  }

  ngOnInit() {
    const menuItems = this.model.menuItems;

    if (this.user.links.questionnaires) {
      menuItems.push({
        important: false,
        icon: 'fal fa-stethoscope',
        url: '../questionnaires',
        name: this.translateService.instant('MENU_PERFORM_MEASUREMENTS'),
      });
    }

    if (this.user.links.threads) {
      menuItems.push({
        important: false,
        icon: 'fal fa-comments',
        url: '../messages',
        name: this.translateService.instant('MENU_MESSAGES'),
      });
    }

    if (this.user.links.acknowledgements) {
      menuItems.push({
        important: false,
        icon: 'fal fa-check-circle',
        url: '../acknowledgements',
        name: this.translateService.instant('MENU_ACKNOWLEDGEMENTS'),
      });
    }

    if (this.user.links.measurements) {
      menuItems.push({
        important: false,
        icon: 'fal fa-chart-line',
        url: '../my_measurements',
        name: this.translateService.instant('MENU_MY_MEASUREMENTS'),
      });
    }

    if (this.config.getAppConfig().showReplies == true) {
      menuItems.push({
        important: false,
        icon: 'fal fa-tasks',
        url: '../questionnaire_results',
        name: this.translateService.instant('MENU_QUESTIONNAIRE_RESULTS'),
      });
    }

    if (this.user.links.linksCategories) {
      menuItems.push({
        important: false,
        icon: 'fal fa-book-medical',
        url: '../links_categories',
        name: this.translateService.instant('MENU_LINKS_CATEGORIES'),
      });
    }

    if (this.user.links.calendar) {
      menuItems.push({
        important: false,
        icon: 'fal fa-calendar-alt',
        url: '../calendar',
        name: this.translateService.instant('MENU_CALENDAR'),
      });
    }

    this.model.canChangePassword =
      this.user.canChangePassword &&
      this.user.links.changePassword !== undefined &&
      !this.isClinician;

    if (this.model.canChangePassword) {
      const info = {
        username: this.user.username,
        changePasswordUrl: this.user.links.changePassword,
      };
      this.appContext.requestParams.set('userInfo', info);
    }
    if (!this.isClinician) {
      this.startIdleWatcher();
    }

    this.setupUnreadCounters(menuItems);

    const videoEnabledRequestDelivered = this.native.clientIsVideoEnabled(
      (response: VideoEnabledResponseMessage): void => {
        if (response.enabled === true) {
          // App might have been opened from an incoming call notification, so check
          this.checkAndJoin();
          this.native.subscribeToMultipleMessages('appResumedEvent', () =>
            this.checkAndJoin()
          );
        }
      }
    );
    if (!videoEnabledRequestDelivered) {
      console.debug(
        "Couldn't deliver videoEnabledRequest -> Video not enabled"
      );
    }

    if (!this.isClinician) {
      // Avoid clinicians getting push notifications from multiple patients
      void this.notifications.ensureDeviceRegisteredForPushNotifications(
        this.user
      );
    }
  }

  private async checkAndJoin() {
    const sessionUrl = this.user?.links.individualSessions;
    if (sessionUrl != null) {
      try {
        await this.videoService.checkForSessionAndJoin(sessionUrl);
      } catch (response) {
        if (response instanceof HttpErrorResponse && response.status == 401) {
          localStorage.removeItem('authToken');
          this.sendToLoginPage();
          this.appContext.requestParams.set(
            'authenticationError',
            'LOGGED_OUT'
          );
          throw undefined;
        } else {
          console.error(
            `Error checking for session: ${JSON.stringify(response)}`
          );
          return;
        }
      }
    }
  }

  sendToLoginPage() {
    // Similar to the function in interceptors.ts but that is unreachable from this module.
    const customUrl = sessionStorage.getItem('loginUrl');
    if (customUrl !== null) {
      void this.router.navigateByUrl(customUrl);
    } else {
      if (this.router.url === '/login') {
        void this.router.navigateByUrl('/', { skipLocationChange: true });
      }
      void this.router.navigate(['login'], {});
    }
  }

  startIdleWatcher(): void {
    if (this.idle.isRunning()) {
      return;
    }
    this.idle.watch();
  }

  updateUnreadMessages(menuItem: MenuItem): void {
    const onSuccess = (data: ThreadsResult) => {
      const unreadMessages = data.results
        .map((m: ThreadRef) => m.unreadFromOrganization)
        .reduce((a: number, b: number) => a + b, 0);

      if (unreadMessages > 0) {
        menuItem.important = true;
      }
      menuItem.name =
        this.translateService.instant('MENU_MESSAGES') + ` (${unreadMessages})`;
    };

    const onError = (response: object) => {
      console.warn(`Failed to fetch message threads with error: ${response}`);
    };

    this.messageThreads.list(this.user, true).then(onSuccess).catch(onError);
  }

  updateQuestionnaireSchedules(menuItem: MenuItem) {
    this.questionnaireSchedules
      .list(this.user, true)
      .pipe(
        map(this.unansweredQuestionnaires),
        tap((schedules: QuestionnaireScheduleSummary[]) => {
          if (schedules.length > 0) menuItem.important = true;
          menuItem.name = `${this.translateService.instant(
            'MENU_PERFORM_MEASUREMENTS'
          )} (${schedules.length})`;
        })
      )
      .subscribe({
        next: (scheduledQuestionnaires: QuestionnaireScheduleSummary[]) => {
          const updateSchedulesRequestDelivered =
            this.native.updateScheduledQuestionnaires(scheduledQuestionnaires);
          if (!updateSchedulesRequestDelivered) {
            console.debug(
              "Couldn't deliver update schedules request due to missing native layer"
            );
          }
        },
        error: (error: any) => {
          console.warn(
            `Failed to fetch questionnaires schedules with error: ${error}`
          );
        },
      });
  }

  private unansweredQuestionnaires(schedules: QuestionnaireScheduleSummary[]) {
    const now = new Date();
    const nextWeek = addWeeks(now, 1);

    return schedules.filter((schedule) => {
      return (
        schedule.scheduleWindowStart &&
        schedule.scheduleWindowStart <= now &&
        schedule.nextDeadline &&
        schedule.nextDeadline <= nextWeek
      );
    });
  }

  private setupUnreadCounters(menuItems: MenuItem[]) {
    const messagesItem = menuItems.find((item) => item.url === '../messages');
    const questionnairesItem = menuItems.find(
      (item) => item.url === '../questionnaires'
    );

    const updateCounters = () => {
      if (this.util.exists(messagesItem)) {
        console.debug('Updating unread messages...');
        this.updateUnreadMessages(messagesItem);
      }

      if (this.util.exists(questionnairesItem)) {
        console.debug('Updating unanswered questionnaires...');
        this.updateQuestionnaireSchedules(questionnairesItem);
      }
    };

    updateCounters();
    this.native.subscribeToMultipleMessages('appResumedEvent', updateCounters);
  }

  goBack(): any {
    if (this.isClinician) {
      console.debug(
        'Going back as a clinician and clearing patient authentication'
      );
      this.appContext.requestParams.getAndClear('selectedPatient');
      this.authentication.deletePatientAuthHeader();
      this.router.navigate(['clinician_menu'], {
        replaceUrl: true,
      });
    } else {
      globalThis.history.back();
    }
  }
}
