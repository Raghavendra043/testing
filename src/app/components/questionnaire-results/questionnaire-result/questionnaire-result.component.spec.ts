import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FakeConfigService } from '@app/mocks/config-service.mock';
import { FakeQuestionnaireResultsService } from '@app/mocks/rest-service.mock';
import { SharedModule } from '@app/shared/shared.module';
import { HeaderModule } from '@components/header/header.module';
import { LoadingModule } from '@components/loading/loading.module';
import { TranslateModule } from '@ngx-translate/core';
import { QuestionnaireResultsService } from '@services/rest-api-services/questionnaire-results.service';
import { ConfigService } from '@services/state-services/config.service';
import { StatePassingService } from '@services/state-services/state-passing.service';

import { QuestionnaireResultComponent } from './questionnaire-result.component';

const baseUrl = 'http://localhost:7000/clinician/api/patients/me';

const showResult = {
  name: 'Blood pressure and pulse',
  severity: 'yellow',
  resultDate: '2016-03-29T10:30:00.000+02:00',
  questions: [
    {
      text: 'Are you feeling well?',
      reply: {
        answer: 'No',
      },
    },
    {
      text: 'Blood pressure',
      severity: 'yellow',
      reply: {
        measurements: [
          {
            timestamp: '2016-03-29T10:30:00.000+02:00',
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
            },
          },
        ],
      },
    },
  ],
  links: {
    questionnaire: `${baseUrl}/questionnaires/28`,
    patient: baseUrl,
    self: `${baseUrl}/questionnaire-results/1`,
  },
};

describe('QuestionnaireResultComponent', () => {
  let component: QuestionnaireResultComponent;
  let fixture: ComponentFixture<QuestionnaireResultComponent>;
  let router: Router;
  let appContext: StatePassingService;
  let questionnaireResults: FakeQuestionnaireResultsService;

  beforeEach(async () => {
    questionnaireResults = new FakeQuestionnaireResultsService(showResult, {});
    appContext = new StatePassingService(router);
    await TestBed.configureTestingModule({
      declarations: [QuestionnaireResultComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HeaderModule,
        LoadingModule,
        SharedModule,
      ],
      providers: [
        {
          provide: ConfigService,
          useValue: new FakeConfigService(),
        },
        {
          provide: StatePassingService,
          useValue: appContext,
        },
        {
          provide: QuestionnaireResultsService,
          useValue: questionnaireResults,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    appContext = TestBed.get(StatePassingService);
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

    questionnaireResults = TestBed.inject(
      QuestionnaireResultsService
    ) as unknown as FakeQuestionnaireResultsService;
    fixture = TestBed.createComponent(QuestionnaireResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have questionnaire result', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.questionnaireResult).toBeDefined();
  });
});
