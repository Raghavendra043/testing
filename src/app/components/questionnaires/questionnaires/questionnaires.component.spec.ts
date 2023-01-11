import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FakeClinicianService,
  FakeQuestionnaireSchedulesService,
  FakeQuestionnairesService,
} from '@app/mocks/rest-service.mock';
import { SharedModule } from '@app/shared/shared.module';
import { HeaderModule } from '@components/header/header.module';
import { LoadingModule } from '@components/loading/loading.module';
import { TranslateModule } from '@ngx-translate/core';
import { ClinicianService } from '@services/rest-api-services/clinician.service';
import { QuestionnaireSchedulesService } from '@services/rest-api-services/questionnaire-schedules.service';
import { QuestionnairesService } from '@services/rest-api-services/questionnaires.service';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { Utils } from '@services/util-services/util.service';
import moment from 'moment';
import { MomentModule } from 'ngx-moment';
import { QuestionnaireComponent } from '../questionnaire/questionnaire.component';
import { Location } from '@angular/common';

import { QuestionnairesComponent } from './questionnaires.component';
const baseUrl = 'http://localhost:7000';
const questionnairesResult = {
  results: [
    {
      name: 'Blood sugar levels',
      version: '1.0',
      links: {
        questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/27`,
      },
    },
    {
      name: 'Blood pressure & pulse',
      version: '2.0',
      links: {
        questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/42`,
      },
    },
  ],
};

const newQuestionnairesResult = {
  results: [
    {
      name: 'Blood sugar',
      version: '1.0',
      links: {
        questionnaire: `${baseUrl}/clinician/api/patients/me/questionnaires/2`,
      },
    },
  ],
};

const now = moment().toDate();
const tomorrow = moment().add(1, 'days').toDate();
const questionnaireSchedulesResult = [
  {
    name: 'Blood sugar levels',
    scheduleWindowStart: now,
    nextDeadline: tomorrow,
  },
];

describe('QuestionnairesComponent', () => {
  let component: QuestionnairesComponent;
  let fixture: ComponentFixture<QuestionnairesComponent>;
  let router: Router;
  let location: Location;
  let appContext: StatePassingService;
  let utils: Utils;
  let questionnaires;

  function init(option: string) {
    appContext = new StatePassingService(router);
    utils = new Utils();

    if (option === 'lengthIsOne') {
      questionnaires = new FakeQuestionnairesService(newQuestionnairesResult);
    } else {
      questionnaires = new FakeQuestionnairesService(questionnairesResult);
    }

    TestBed.configureTestingModule({
      declarations: [QuestionnairesComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        HeaderModule,
        LoadingModule,
        SharedModule,
        MomentModule,
        RouterTestingModule.withRoutes([
          {
            path: 'questionnaires',
            component: QuestionnairesComponent,
          },
          {
            path: 'questionnaires/:id/questionnaire',
            component: QuestionnaireComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: StatePassingService,
          useValue: appContext,
        },
        {
          provide: Utils,
          useValue: utils,
        },
        {
          provide: QuestionnairesService,
          useValue: questionnaires,
        },
        {
          provide: QuestionnaireSchedulesService,
          useValue: new FakeQuestionnaireSchedulesService(
            questionnaireSchedulesResult
          ),
        },
        {
          provide: ClinicianService,
          useValue: new FakeClinicianService(),
        },
      ],
    });
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    appContext = TestBed.inject(StatePassingService);
    appContext.currentUser.set({
      firstName: 'first name',
      lastName: 'last name',
      //@ts-ignore
      links: {
        questionnaires: `${baseUrl}/clinician/api/patients/me/questionnaires`,
        questionnaireSchedules: `${baseUrl}/clinician/api/patients/me/questionnaire_schedules`,
      },
    });
    fixture = TestBed.createComponent(QuestionnairesComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  }

  describe('when rest response contains multiple results the component', () => {
    beforeEach(() => {
      init('lengthIsNotOne');
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get all questionnaires for user (and properly marked)', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.model.questionnaires.length).toEqual(2);
      //   expect(component.model).toEqual(questionnairesResult); // TODO: Fine to remove this?
      expect(component.model.questionnaires[0].scheduleWindow).toBeDefined();
      expect(
        component.model.questionnaires[0].scheduleWindow.end
      ).toBeDefined();
      expect(component.model.questionnaires[1].scheduleWindow).toBeUndefined();
    });

    it('should open questionnaire when clicked', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const assertion = {
        ...questionnairesResult.results[1],
        ...{ marked: false },
      };

      component.showQuestionnaire(1);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(location.path()).toEqual('/questionnaires/1/questionnaire');
      expect(
        appContext.requestParams.getAndClear('selectedQuestionnaire')
      ).toEqual(assertion);
    });
  });

  describe('when rest response contains one result the component', () => {
    beforeEach(() => {
      init('lengthIsOne');
    });

    it('should automatically redirect to questionnaire if list only contains one', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(location.path()).toEqual('/questionnaires/0/questionnaire');
    });
  });
});
