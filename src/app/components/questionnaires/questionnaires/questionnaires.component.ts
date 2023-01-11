import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { User } from 'src/app/types/user.type';
import { Utils } from 'src/app/services/util-services/util.service';
import { QuestionnairesService } from 'src/app/services/rest-api-services/questionnaires.service';
import { QuestionnaireSchedulesService } from 'src/app/services/rest-api-services/questionnaire-schedules.service';
import { LoadingState } from '@app/types/loading.type';
import {
  QuestionnaireRef,
  Questionnaires,
} from '@app/types/questionnaires.type';
import { QuestionnaireScheduleSummary } from '@app/types/questionnaire-schedules.type';
import { isSameDay, subWeeks } from 'date-fns';
import moment from 'moment';
import { ClinicianService } from '@services/rest-api-services/clinician.service';

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.less'],
})
export class QuestionnairesComponent implements OnInit {
  model: {
    state: LoadingState;
    questionnaires: (QuestionnaireRef & { marked: boolean })[];
  } = {
    state: 'Loading',
    questionnaires: [],
  };
  user: User;
  isClinician = false;

  constructor(
    private appContext: StatePassingService,
    private utils: Utils,
    private questionnaires: QuestionnairesService,
    private questionnaireSchedules: QuestionnaireSchedulesService,
    private translate: TranslateService,
    private router: Router,
    private clinician: ClinicianService
  ) {
    const user = this.appContext.getUser();
    if (user === undefined) {
      this.model.state = 'Failed';
      throw new TypeError('No current user');
    } else {
      this.user = user;
    }
    this.isClinician = this.clinician.isClinician();
  }

  ngOnInit() {
    this.questionnaires
      .list(this.user)
      .then((result) => this.receivedQuestionnaires(result))
      .catch((error) => this.onError(error));
  }

  showQuestionnaire(selected: number) {
    const questionnaireRef = this.model.questionnaires[selected];
    questionnaireRef.marked = false;
    this.appContext.requestParams.set(
      'selectedQuestionnaire',
      questionnaireRef
    );
    this.appContext.requestParams.set('questionnaireId', selected);

    if (this.isClinician) {
      void this.router.navigate(['questionnaires', selected, 'questionnaire']);
    } else {
      void this.router.navigate(
        ['questionnaires', selected, 'questionnaire'],
        this.model.questionnaires.length === 1 ? { replaceUrl: true } : {}
      );
    }
  }

  receivedQuestionnaires = (response: Questionnaires) => {
    const questionnaires = response.results;
    this.model.questionnaires = questionnaires.map((questionnaire) => ({
      ...questionnaire,
      marked: false,
    }));
    this.model.state = 'Loaded';

    if (questionnaires.length === 1 && !this.isClinician) {
      this.showQuestionnaire(0);
    }

    const receivedSchedules = (schedules: QuestionnaireScheduleSummary[]) => {
      const questionnaires = this.model.questionnaires;
      this.model.questionnaires = questionnaires.map((questionnaire) => {
        const schedule = schedules.find(
          (schedule) => questionnaire.name === schedule.name
        );

        if (
          !this.utils.exists(schedule) ||
          !this.utils.exists(schedule.nextDeadline) ||
          !this.utils.exists(schedule.scheduleWindowStart)
        ) {
          return questionnaire;
        }
        const nextDeadline = schedule.nextDeadline;
        const scheduleWindowStart = schedule.scheduleWindowStart;

        const weekBeforeDeadline = subWeeks(nextDeadline, 1);
        const now = new Date();

        // Only shown upcoming schedule window for questionnaires that have to
        // be answered within the next week.
        if (now < weekBeforeDeadline) {
          return questionnaire;
        }

        // Formats to local time and replaces spaces with non-breaking spaces
        // so lines don't break before AM/PM
        const formatLocalTime = (datetime: Date) =>
          moment(datetime).format('LT');

        if (isSameDay(scheduleWindowStart, nextDeadline)) {
          if (isSameDay(now, nextDeadline)) {
            const todayDeadline =
              this.translate.instant('TODAY') +
              ', ' +
              formatLocalTime(nextDeadline);
            questionnaire.scheduleWindow = {
              end: todayDeadline,
              open: true,
            };
            return questionnaire;

            // If outside schedule window
          } else {
            questionnaire.scheduleWindow = {
              end: moment(nextDeadline).format('ddd'),
              open: false,
            };
            return questionnaire;
          }

          // If schedule window spans more than one day
        } else {
          // If not yet in schedule window
          if (now <= scheduleWindowStart) {
            questionnaire.scheduleWindow = {
              end: moment(nextDeadline).format('ddd'),
              open: false,
            };
            return questionnaire;
          }

          // If within schedule window and deadline is today
          if (isSameDay(now, nextDeadline)) {
            const todayDeadline =
              this.translate.instant('TODAY') +
              ', ' +
              formatLocalTime(nextDeadline);

            questionnaire.scheduleWindow = {
              end: todayDeadline,
              open: true,
            };
            return questionnaire;

            // If within schedule window and deadline is a later date
          } else {
            questionnaire.scheduleWindow = {
              end: moment(nextDeadline).format('ddd, LT'),
              open: true,
            };
            return questionnaire;
          }
        }
      });
    };

    this.questionnaireSchedules
      .list(this.user, false)
      .subscribe(receivedSchedules);
  };

  onError = (data: unknown) => {
    this.model.state = 'Failed';
    console.error(`Failed to load questionnaires due to error: ${data}`);
  };

  goOtherQuestionnaires() {
    this.router.navigate(['questionnaires/other_questionnaires']);
  }
}
