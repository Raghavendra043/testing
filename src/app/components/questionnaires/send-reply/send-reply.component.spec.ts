import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderModule } from '@components/header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { SendReplyComponent, SendReplyState } from './send-reply.component';
import { Location } from '@angular/common';
import { NativeService } from '@services/native-services/native.service';
import { QuestionnairesService } from '@services/rest-api-services/questionnaires.service';
import { FakeQuestionnairesService } from '@app/mocks/rest-service.mock';
import { MenuComponent } from '@components/menu/menu/menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { QuestionnaireComponent } from '../questionnaire/questionnaire.component';

const currentQuestionnaire = {
  name: 'Blodsukker (manuel)',
  id: 27,
  startNode: '157',
  endNode: '159',
  nodes: [
    {
      IONode: {
        nodeName: '157',
        elements: [
          {
            TextViewElement: {
              text: 'Time to measure blood sugar!',
            },
          },
          {
            ButtonElement: {
              text: 'Næste',
              gravity: 'center',
              next: '158',
            },
          },
        ],
      },
    },
    {
      BloodSugarManualDeviceNode: {
        nodeName: '158',
        next: 'ANSEV_159_D158',
        nextFail: 'AN_158_CANCEL',
        text: 'Blodsukker',
        bloodSugarMeasurements: {
          name: '158.BS#BLOODSUGARMEASUREMENTS',
          type: 'Integer',
        },
        deviceId: {
          name: '158.BS#DEVICE_ID',
          type: 'String',
        },
      },
    },
    {
      EndNode: {
        nodeName: '159',
      },
    },
  ],
  output: [],
  links: {
    self: 'http://localhost:7000/patient/questionnaires/27',
    questionnaireResult:
      'http://localhost:7000/patient/questionnaires/27/results',
  },
};

const questionnaireState = {
  outputs: [
    {
      name: 'test name',
      value: 1234,
    },
  ],
  questionnaire: currentQuestionnaire,
  questionnaireRef: { id: 1 },
  nodeHistory: ['123', '456'],
  outputModel: { someNode: {} },
};

class FakeNativeService extends NativeService {}

describe('SendReplyComponent', () => {
  let component: SendReplyComponent;
  let fixture: ComponentFixture<SendReplyComponent>;
  let appContext: StatePassingService;
  let router: Router;
  let location: Location;
  let nativeService: NativeService;
  let questionnairesService: any;

  async function init(fn?: any, resolve?: boolean) {
    // @ts-ignore
    globalThis = {
      history: {
        back: () => {},
      },
    };
    appContext = new StatePassingService(router);
    questionnairesService = new FakeQuestionnairesService({}, resolve);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        HeaderModule,
        RouterTestingModule.withRoutes([
          {
            path: 'menu',
            component: MenuComponent,
          },
          {
            path: 'questionnaires/:id/questionnaire',
            component: QuestionnaireComponent,
          },
        ]),
      ],
      declarations: [SendReplyComponent],
      providers: [
        {
          provide: StatePassingService,
          useValue: appContext,
        },
        {
          provide: NativeService,
          useValue: new FakeNativeService(),
        },
        {
          provide: QuestionnairesService,
          useValue: questionnairesService,
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    appContext = TestBed.inject(StatePassingService);
    nativeService = TestBed.inject(NativeService);
    questionnairesService = TestBed.inject(QuestionnairesService);

    appContext.requestParams.set('questionnaireState', questionnaireState);
    if (fn) {
      fn();
    }
    fixture = TestBed.createComponent(SendReplyComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  }

  describe('preconditions', () => {
    const initFn = () => {
      appContext.requestParams.getAndClear('questionnaireState'); // clear it...
    };
    beforeEach(async () => {
      await init(initFn);
    });

    it('should redirect back to menu page if no questionnaire state has been set', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(location.path()).toBe('/menu');
    });
  });

  describe('Back button', () => {
    beforeEach(async () => {
      await init();
    });

    it('should navigate back to questionnaire page when back button clicked', async () => {
      //@ts-ignore
      globalThis = {
        history: {
          back: () => {
            router.navigate(['/questionnaires/0/questionnaire']);
          },
        },
      };
      const navigateSpy = spyOn(router, 'navigate');
      fixture.detectChanges();
      await fixture.whenStable();
      component.goBack();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(navigateSpy).toHaveBeenCalledWith([
        '/questionnaires/0/questionnaire',
      ]);
    });

    it('should transfer state back to questionnaire page when back button clicked', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      component.goBack();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        appContext.requestParams.getAndClear('selectedQuestionnaire')
      ).toEqual({ id: 1 });
      expect(
        appContext.requestParams.getAndClear('questionnaireState')
      ).toEqual(questionnaireState);
    });
  });

  describe('when questionnaire service resolves, collect and send output', () => {
    beforeEach(async () => {
      await init(null, true);
    });

    it('should start by showing send reply confirmation page', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.model.state).toEqual(SendReplyState.CONFIRM);
    });

    it('should show progress page while uploading reply', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      component.sendClick();
      expect(component.model.state).toEqual(SendReplyState.UPLOADING);
      expect(component.model.title).toEqual('UPLOADING_REPLIES_TEXT');
    });

    it('should show acknowledge page and allow user to navigate to menu', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      spyOn(nativeService, 'clearScheduledQuestionnaire');

      component.sendClick();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.model.state).toEqual(SendReplyState.ACKNOWLEDGE);
      expect(nativeService.clearScheduledQuestionnaire).toHaveBeenCalled();

      expect(component.model.title).toEqual('SEND_REPLIES_TITLE');
      component.ackOkClick();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(location.path()).toMatch(/menu/);
    });
  });

  describe('when questionnaire service rejects, collect and send output', () => {
    it('should show retry and cancel buttons when upload fails', async () => {
      await init(null, false);
      await fixture.whenStable();
      component.sendClick();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.model.state).toEqual(SendReplyState.FAILED);
    });
  });

  it('should show acknowledge page if retry succeeds', async () => {
    await init(null, false);
    fixture.detectChanges();
    await fixture.whenStable();
    component.sendClick();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.model.state).toEqual(SendReplyState.FAILED);
    spyOn(questionnairesService, 'replyTo').and.callFake(() => {
      return Promise.resolve();
    });
    component.sendClick();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.model.state).toEqual(SendReplyState.ACKNOWLEDGE);
    expect(component.model.title).toEqual('SEND_REPLIES_TITLE');
  });

  it('should redirect to menu if cancelling retry', async () => {
    await init(null, false);
    await fixture.whenStable();
    component.sendClick();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.model.state).toEqual(SendReplyState.FAILED);
    component.cancelRetryClick();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(location.path()).toMatch(/menu/);
  });
});
