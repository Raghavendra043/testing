import { fakeAsync, tick } from '@angular/core/testing';
import { Utils } from '../util-services/util.service';
import { QuestionnaireSchedulesService } from './questionnaire-schedules.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { validUser } from '@app/mocks/user.mock';
import { User } from '@app/types/user.type';
const user: User = {
  ...validUser,
  links: { ...validUser.links },
};

describe('QuestionnaireSchedulesService', () => {
  let service: QuestionnaireSchedulesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let utils: Utils;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    utils = new Utils();
    service = new QuestionnaireSchedulesService(utils, httpClientSpy);
  });

  describe('list all questionnaire schedules for user', () => {
    it('should not invoke callback when status is 401', fakeAsync(() => {
      let successCallbackInvoked = false;
      let errorCallbackInvoked = false;
      tick();

      // @ts-ignore
      httpClientSpy.get.and.callFake((url: any) => {
        if (url === user.links.questionnaireSchedules) {
          return throwError({ status: 401, data: {} });
        } else {
          return of({ status: 200, data: {} });
        }
      });

      service.list(user, false).subscribe({
        next: () => {
          successCallbackInvoked = true;
        },
        error: () => {
          errorCallbackInvoked = true;
        },
      });
      tick();

      expect(successCallbackInvoked).toBe(false);
      expect(errorCallbackInvoked).toBe(true);
    }));

    // it('should throw exception when user has no link to questionnaire schedules', fakeAsync(() => { // TODO: outcommened since questionnaire schedules is required
    //   instantiateService(200, {});
    //   tick();
    //   expect(() => {
    //     service.list({}, false).then(() => {});
    //   }).toThrow();
    //   expect(() => {
    //     service.list({ links: {} }, false).then(() => {});
    //   }).toThrow();
    // }));

    it('should invoke success callback when response is valid', fakeAsync(() => {
      let successCallbackInvoked = false;
      let errorCallbackInvoked = false;

      // @ts-ignore
      httpClientSpy.get.and.callFake((url: any) => {
        if (url === user.links.questionnaireSchedules) {
          return of({ questionnaireSchedules: [] });
        } else {
          return throwError({ status: 404, data: {} });
        }
      });

      service.list(user, false).subscribe({
        next: () => {
          successCallbackInvoked = true;
        },
        error: () => {
          errorCallbackInvoked = true;
        },
      });

      tick();
      expect(successCallbackInvoked).toEqual(true);
      expect(errorCallbackInvoked).toEqual(false);
    }));

    it('should transform response to client object', fakeAsync(() => {
      let successCallbackInvoked = false;
      let errorCallbackInvoked = false;
      const responseObj: any = {
        startDate: '2019-08-22T22:00:00.000Z',
        onlyShowOnAnsweringDay: false,
        questionnaireSchedules: [
          {
            questionnaireName: 'Blood sugar levels',
            type: 'WEEKDAYS',
            links: {
              questionnaireSchedule: user.links.questionnaireSchedules + '/3',
              questionnaireDefinition:
                'http://localhost:8080/clinician/api/questionnaire_definitions/2',
              questionnaire:
                'http://localhost:8080/clinician/api/questionnaires/2',
            },
            scheduledTime: {
              reminderStartMinutes: 30,
              timesOfDay: '12:00',
              weekdays: [
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
                'SUNDAY',
              ],
            },
            scheduleWindowMinutes: 600,
            nextDeadline: '2019-09-06T10:00:00.000Z',
          },
        ],
      };

      // @ts-ignore
      httpClientSpy.get.and.callFake((url: any) => {
        if (url === user.links.questionnaireSchedules) {
          return of(responseObj);
        } else {
          return throwError({ status: 404, data: {} });
        }
      });

      let data: any = [];
      service.list(user, false).subscribe({
        next: (response: any) => {
          data = response;
          successCallbackInvoked = true;
        },
        error: () => {
          errorCallbackInvoked = true;
        },
      });
      tick();
      expect(successCallbackInvoked).toEqual(true);
      expect(errorCallbackInvoked).toEqual(false);
      expect(data.length).toEqual(1);
      expect(data[0].name).toEqual('Blood sugar levels');
      expect(new Date(data[0].scheduleWindowStart)).toEqual(
        new Date('2019-09-06T00:00:00.000Z')
      );
      expect(new Date(data[0].nextDeadline)).toEqual(
        new Date('2019-09-06T10:00:00.000Z')
      );
    }));
  });
});
