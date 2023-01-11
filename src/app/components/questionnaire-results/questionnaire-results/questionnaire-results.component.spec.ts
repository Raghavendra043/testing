import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { Location } from '@angular/common';
import { QuestionnaireResultsComponent } from './questionnaire-results.component';
import { QuestionnaireResultsService } from 'src/app/services/rest-api-services/questionnaire-results.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderModule } from '../../header/header.module';
import { QuestionnaireResultComponent } from '../questionnaire-result/questionnaire-result.component';
import { LoadingModule } from '../../loading/loading.module';
import { ConfigService } from '@services/state-services/config.service';
import { FakeConfigService } from '@app/mocks/config-service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@app/shared/shared.module';
import { QuestionnaireResults } from '@app/types/questionnaire-results.type';
import { FakeQuestionnaireResultsService } from '@app/mocks/rest-service.mock';

const baseUrl = 'http://localhost:7000/clinician/api/patients/me';
const showResult: QuestionnaireResults = {
  name: 'Blood pressure and pulse',
  acknowledgement: undefined,
  severity: 'yellow',
  resultDate: '2016-03-29T10:30:00.000+02:00',
  questions: [
    {
      text: 'Are you feeling well?',
      patientText: '',
      reply: {
        answer: 'No',
      },
    },
    {
      text: 'Blood pressure',
      severity: 'yellow',
      patientText: '',
      reply: {
        measurements: [
          {
            timestamp: '2016-03-29T10:30:00.000+02:00',
            severity: 'yellow',
            type: 'blood_pressure',
            measurement: {
              unit: 'mmHg',
              systolic: 129,
              diastolic: 80,
            },
            origin: {
              manual_measurement: {
                entered_by: 'citizen',
              },
            },
            links: {
              measurement: `${baseUrl}/measurements/1`,
              patient: `${baseUrl}/patients/1`,
            },
          },
        ],
      },
    },
  ],
  links: {
    //@ts-ignore
    questionnaire: `${baseUrl}/questionnaires/28`,
    patient: baseUrl,
    self: `${baseUrl}/questionnaire-results/1`,
  },
};

const listResult: QuestionnaireResults = {
  results: [
    {
      name: 'Blood pressure and pulse',
      severity: 'red',
      acknowledged: false,
      resultDate: '2016-03-29T10:30:00.000+02:00',
      links: {
        patient: baseUrl,
        questionnaire: `${baseUrl}/questionnaires/28`,
        questionnaireResult: `${baseUrl}/questionnaire-results/1`,
      },
    },
    {
      name: 'Saturation',
      severity: 'green',
      acknowledged: true,
      resultDate: '2016-03-28T00:20:47.903+02:00',
      links: {
        patient: baseUrl,
        questionnaire: `${baseUrl}/questionnaires/29`,
        questionnaireResult: `${baseUrl}/questionnaire-results/2`,
      },
    },
    {
      name: 'Weight',
      severity: 'yellow',
      acknowledged: true,
      resultDate: '2016-03-23T08:15:00.000+01:00',
      links: {
        patient: baseUrl,
        questionnaire: `${baseUrl}/questionnaires/30`,
        questionnaireResult: `${baseUrl}/questionnaire-results/3`,
      },
    },
    {
      name: 'Blood sugar',
      severity: 'red',
      acknowledged: false,
      resultDate: '2016-03-22T11:35:00.000+01:00',
      links: {
        patient: baseUrl,
        questionnaire: `${baseUrl}/questionnaires/31`,
        questionnaireResult: `${baseUrl}/questionnaire-results/4`,
      },
    },
    {
      name: 'Spirometry',
      severity: 'yellow',
      acknowledged: false,
      resultDate: '2016-03-21T07:10:00.000+01:00',
      links: {
        patient: baseUrl,
        questionnaire: `${baseUrl}/questionnaires/32`,
        questionnaireResult: `${baseUrl}/questionnaire-results/5`,
      },
    },
  ],
  total: 200,
  max: 5,
  offset: 0,
  links: {
    self: `${baseUrl}/questionnaire-results?offset=0&max=5`,
  },
};
const newListResult = {
  results: [
    {
      name: 'Blood pressure and pulse',
      severity: 'red',
      acknowledged: false,
      resultDate: '2016-03-29T10:30:00.000+02:00',
      links: {
        patient: baseUrl,
        questionnaire: `${baseUrl}/questionnaires/28`,
        questionnaireResult: `${baseUrl}/questionnaire-results/1`,
      },
    },
  ],
};

describe('QuestionnaireResultsComponent', () => {
  let component: QuestionnaireResultsComponent;
  let fixture: ComponentFixture<QuestionnaireResultsComponent>;
  let router: Router;
  let location: Location;
  let appContext: StatePassingService;
  let questionnaireResults: FakeQuestionnaireResultsService;
  function init(option: string) {
    if (option === 'lengthIsOne') {
      questionnaireResults = new FakeQuestionnaireResultsService(
        showResult,
        newListResult
      );
    } else {
      questionnaireResults = new FakeQuestionnaireResultsService(
        showResult,
        listResult
      );
    }
    appContext = new StatePassingService(router);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        HeaderModule,
        LoadingModule,
        SharedModule,
        RouterTestingModule.withRoutes([
          {
            path: 'questionnaire_results',
            component: QuestionnaireResultsComponent,
          },
          {
            path: 'questionnaire_results/:id/questionnaire_result',
            component: QuestionnaireResultComponent,
          },
        ]),
      ],
      declarations: [QuestionnaireResultsComponent],
      providers: [
        { provide: ConfigService, useClass: FakeConfigService },
        {
          provide: StatePassingService,
          useValue: appContext,
        },
        {
          provide: QuestionnaireResultsService,
          useValue: questionnaireResults,
        },
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    questionnaireResults = TestBed.inject(
      QuestionnaireResultsService
    ) as unknown as FakeQuestionnaireResultsService;

    appContext.currentUser.set({
      //@ts-ignore
      links: {
        questionnaireResults: `${baseUrl}/questionnaire-results`,
      },
    });
    appContext.requestParams.set('selectedQuestionnaireResult', {
      name: 'Blood pressure and pulse',
      severity: 'red',
      acknowledged: false,
      resultDate: '2016-03-29T10:30:00.000+02:00',
      links: {
        patient: `${baseUrl}/clinician/api/patients/me`,
        questionnaire: `${baseUrl}/clinician/api/questionnaires/28`,
        questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaire-results/1`,
      },
    });

    fixture = TestBed.createComponent(QuestionnaireResultsComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  }

  describe('when list response contains multiple results the component', () => {
    beforeEach(() => {
      init('lengthIsNotOne');
    });

    it('should be defined', fakeAsync(() => {
      tick();
      expect(component).toBeDefined();
    }));

    it('should have questionnaire results', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.model.questionnaireResults).toBeDefined();

      expect(component.model.questionnaireResults.length).toEqual(5);
      expect(component.model.questionnaireResults).toEqual(listResult.results);
    });

    it('should open questionnaire result when clicked', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      component.showQuestionnaireResult(listResult.results[0], 0);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(location.path()).toEqual(
        '/questionnaire_results/0/questionnaire_result'
      );
      expect(
        appContext.requestParams.getAndClear('selectedQuestionnaireResult')
      ).toEqual(listResult.results[0]);
    });
  });

  describe('when list response contains one result the component', () => {
    beforeEach(() => {
      init('lengthIsOne');
    });

    it('should automatically redirect to questionnaire result if list only contains one', async () => {
      const navigateSpy = spyOn(router, 'navigate');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(navigateSpy).toHaveBeenCalledWith(
        ['/questionnaire_results/0/questionnaire_result'],
        { replaceUrl: true }
      );
    });
  });
});
