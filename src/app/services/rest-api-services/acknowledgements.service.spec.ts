import { HttpClient } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { mockUser } from '@app/mocks/state-passing-service.mock';
import { validUser } from '@app/mocks/user.mock';
import { User } from '@app/types/user.type';
import { of, throwError } from 'rxjs';
import { AcknowledgementsResult } from 'src/app/types/acknowledgements.type';
import { AcknowledgementsService } from './acknowledgements.service';

const acknowledgementsResult: AcknowledgementsResult = {
  acknowledgements: [
    {
      name: 'ECG',
      type: 'questionnaire',
      uploadTimestamp: '2022-07-18T12:30:00.000Z',
      acknowledgementTimestamp: '2022-07-18T14:30:00.000Z',
      links: {
        questionnaire:
          'http://localhost/clinician/api/patients/me/questionnaires/42',
      },
    },
    {
      system: 'Measurements',
      type: 'externalMeasurement',
      uploadTimestamp: '2022-07-18T10:30:00.000Z',
      acknowledgementTimestamp: '2022-07-18T11:30:00.000Z',
    },
  ],
};

describe('AcknowledgementsService', () => {
  let acknowledgementsService: AcknowledgementsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    acknowledgementsService = new AcknowledgementsService(httpClientSpy);
  });

  describe('list all acknowledgements for user', () => {
    it('should not invoke callback when status is 401', fakeAsync(() => {
      httpClientSpy.get.and.returnValue(
        throwError(() => acknowledgementsResult)
      );
      let successCallbackInvoked!: boolean;
      acknowledgementsService.list(mockUser).then(
        () => {
          successCallbackInvoked = true;
        },
        () => {
          successCallbackInvoked = false;
        }
      );
      tick();
      expect(httpClientSpy.get).toHaveBeenCalled();
      expect(successCallbackInvoked).toBe(false);
    }));

    it('should throw exception when user has no link to acknowledgements', async () => {
      await expectAsync(
        acknowledgementsService.list({} as User)
      ).toBeRejected();

      await expectAsync(
        acknowledgementsService.list({
          links: {},
        } as User)
      ).toBeRejected();
    });

    it('should invoke success callback when response is valid', fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(acknowledgementsResult));

      let successCallbackInvoked!: boolean;
      acknowledgementsService.list(validUser).then(() => {
        successCallbackInvoked = true;
      });
      tick();
      expect(successCallbackInvoked).toEqual(true);
    }));

    it('should transform response to client object', async () => {
      httpClientSpy.get.and.returnValue(of(acknowledgementsResult));

      const acknowledgements = await acknowledgementsService.list(validUser);

      expect(httpClientSpy.get).toHaveBeenCalled();

      expect(acknowledgements).toHaveSize(2);
      const [ack1, ack2] = acknowledgements;

      expect(ack1.type).toBe('questionnaire');
      expect(ack2.type).toBe('externalMeasurement');
    });
  });
});
