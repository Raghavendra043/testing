import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNotificationsService } from 'src/app/mocks/notifications-service.mock';
import { FakeQuestionnaireScheduleService } from 'src/app/mocks/questionnaire-schedules-service.mock';
import { FakeVideoService } from 'src/app/mocks/video-service.mock';
import { NativeService } from 'src/app/services/native-services/native.service';
import { MessageThreadsService } from 'src/app/services/rest-api-services/message-threads.service';
import { NotificationsService } from 'src/app/services/rest-api-services/notifications.service';
import { QuestionnaireSchedulesService } from 'src/app/services/rest-api-services/questionnaire-schedules.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { Utils } from 'src/app/services/util-services/util.service';
import { VideoService } from 'src/app/services/video-services/video.service';
import { HeaderModule } from '../../header/header.module';
import { LoginComponent } from '../../login/login/login.component';
import { Location } from '@angular/common';
import { MenuComponent } from './menu.component';
import { FakeIdle } from 'src/app/mocks/idle.mock';
import { Idle } from '@ng-idle/core';
import { mockUser } from '@app/mocks/state-passing-service.mock';
import { ConfigService } from '@services/state-services/config.service';
import { FakeConfigService } from '@app/mocks/config-service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuestionnaireScheduleSummary } from '@app/types/questionnaire-schedules.type';
import { FakeMessageThreadService } from '@app/mocks/rest-service.mock';

const messageThreadResponse = {
  links: {
    self: 'https://ode-demo.oth.io/chat/threads',
  },
  max: 100,
  offset: 0,
  results: [
    {
      latestMessageAt: '2022-10-07T07:34:41.734073Z',
      links: {
        messages:
          'https://ode-demo.oth.io/chat/threads/09e816fe-23c1-483d-a819-ec39b8a2587c/messages',
        organization:
          'https://ode-demo.oth.io/organizations/organizations/3129f001-8a9e-416c-b9c9-524666cb8bf7',
        patient: 'https://ode-demo.oth.io/clinician/api/patients/59',
        thread:
          'https://ode-demo.oth.io/chat/threads/09e816fe-23c1-483d-a819-ec39b8a2587c',
      },
      organizationName: 'Department Y',
      unreadFromOrganization: 3,
      unreadFromPatient: 0,
    },
  ],
  total: 1,
};

class FakeNativeService extends NativeService {
  override clientIsVideoEnabled = (callback: any): any => {
    callback({ enabled: true });
  };
  override subscribeToMultipleMessages = (msg: any, callback: any) => {
    // nothing
  };
  override updateScheduledQuestionnaires = (
    scheduledQuestionnaires: QuestionnaireScheduleSummary[]
  ): boolean => {
    return true;
    // nothing
  };
}

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let location: Location;
  let router: any;
  let appContext: StatePassingService;
  let utilService: Utils;
  let messageThreadsService: FakeMessageThreadService;
  let questionnaireSchedulesService: FakeQuestionnaireScheduleService;
  let videoService: FakeVideoService;
  let notificationsService: FakeNotificationsService;
  let idle: FakeIdle;
  let userCanChangePassword = true;

  const beforeEachAsyncFn = async () => {
    appContext = new StatePassingService(router);
    utilService = new Utils();
    messageThreadsService = new FakeMessageThreadService(messageThreadResponse);
    questionnaireSchedulesService = new FakeQuestionnaireScheduleService();
    videoService = new FakeVideoService({});
    notificationsService = new FakeNotificationsService();
    idle = new FakeIdle();

    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'login',
            component: LoginComponent,
          },
        ]),
        HeaderModule,
      ],
      providers: [
        { provide: ConfigService, useClass: FakeConfigService },
        { provide: StatePassingService, useValue: appContext },
        { provide: Utils, useValue: utilService },
        { provide: MessageThreadsService, useValue: messageThreadsService },
        {
          provide: QuestionnaireSchedulesService,
          useValue: questionnaireSchedulesService,
        },
        { provide: VideoService, useValue: videoService },
        { provide: NotificationsService, useValue: notificationsService },
        {
          provide: Idle,
          useValue: idle,
        },
        { provide: NativeService, useValue: new FakeNativeService() },
      ],
    }).compileComponents();
  };

  const menuItemsContains = (menuItems: any, url: any) => {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].url === url) {
        return true;
      }
    }

    return false;
  };

  const beforeEachFn = (fn?: any) => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);

    const user = mockUser;
    user.canChangePassword = userCanChangePassword;
    appContext.currentUser.set(user);
    if (fn) {
      fn();
    }

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  };

  const instantiateComponent = (fn?: any) => {
    beforeEachAsyncFn();
    beforeEachFn(fn);
  };

  it('should create', fakeAsync(() => {
    instantiateComponent();
    tick();
    expect(component).toBeTruthy();
  }));

  it('should have menuItems', fakeAsync(() => {
    instantiateComponent();
    tick();
    expect(component.model.menuItems).toBeDefined();
  }));

  it('should disable change password menu item if user cannot change password', fakeAsync(() => {
    const setUserChangePw = () => {
      userCanChangePassword = false;
    };
    instantiateComponent(setUserChangePw);
    tick();

    expect(
      menuItemsContains(component.model.menuItems, '../change_password')
    ).toBeFalsy();
  }));

  it('should enable menu items if user has link to area', fakeAsync(() => {
    const setUser = () => {
      appContext.currentUser.set({
        links: {
          questionnaires: 'bla',
          measurements: 'bla',
          threads: 'bla',
          questionnaireSchedules: 'bla',
          //@ts-ignore
          unreadMessages: 'bla',
          changePassword: 'bla',
        },
      });
    };
    instantiateComponent(setUser);
    tick();
    expect(component.model.menuItems.length).toBe(4);
    expect(
      menuItemsContains(component.model.menuItems, '../questionnaires')
    ).toBeTruthy();
    expect(
      menuItemsContains(component.model.menuItems, '../questionnaire_results')
    ).toBeTruthy();
    expect(
      menuItemsContains(component.model.menuItems, '../my_measurements')
    ).toBeTruthy();
    expect(
      menuItemsContains(component.model.menuItems, '../messages')
    ).toBeTruthy();
  }));

  it('should call video facade if client video is enabled', fakeAsync(() => {
    const setupSpy = () => {
      spyOn(videoService, 'checkForSessionAndJoin').and.callThrough();
    };

    instantiateComponent(setupSpy);
    tick();

    expect(videoService.checkForSessionAndJoin).toHaveBeenCalled();
  }));

  it('should ensure that device is registered for push notifications', fakeAsync(() => {
    const setupSpy = () => {
      spyOn(
        notificationsService,
        'ensureDeviceRegisteredForPushNotifications'
      ).and.callThrough();
    };

    instantiateComponent(setupSpy);
    tick();

    expect(
      notificationsService.ensureDeviceRegisteredForPushNotifications
    ).toHaveBeenCalled();
  }));

  it('should start idle checking if not started', fakeAsync(() => {
    const setupSpy = () => {
      spyOn(idle, 'watch');
      spyOn(idle, 'isRunning').and.returnValue(false);
    };
    instantiateComponent(setupSpy);
    tick();

    expect(idle.watch).toHaveBeenCalled();
  }));

  it('should not start idle checking if already running, to avoid a reset', fakeAsync(() => {
    const setupSpy = () => {
      spyOn(idle, 'watch');
      spyOn(idle, 'isRunning').and.returnValue(true);
    };
    instantiateComponent(setupSpy);
    tick();

    expect(idle.watch).not.toHaveBeenCalled();
  }));
});
