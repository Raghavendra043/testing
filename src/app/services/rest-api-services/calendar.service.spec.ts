import { HttpClient } from '@angular/common/http';
import { validUser } from '@app/mocks/user.mock';
import { User } from '@app/types/user.type';
import moment from 'moment';
import { of } from 'rxjs';
import { CalendarService } from './calendar.service';

const currentDate = moment().startOf('day').toISOString();
const calendarResult = {
  total: 2,
  offset: 2,
  max: 6,
  links: {
    self: `http://localhost:3000/calendar/events?from_date=${currentDate}&offset=2&total=2`,
    previous: `http://localhost:3000/calendar/events?from_date=${currentDate}&offset=0&total=2`,
    next: `http://localhost:3000/calendar/events?from_date=${currentDate}&offset=4&total=2`,
  },
  results: [
    {
      description: 'Weekly meeting with Nancy Ann',
      type: 'individual_session',
      links: {
        origin: 'http://localhost:3000/meetings/individual-sessions/1',
        event: 'http://localhost:3000/calendar/events/1',
      },
      schedule: {
        startTime: '2018-07-16T08:48:58Z',
      },
      party: {
        clinicians: [
          {
            firstName: 'Helen',
            lastName: 'Anderson',
            username: 'HelenAnderson',
            email: 'helen@example.com',
            links: {
              clinician: 'http://localhost:3000/api/clinicians/1',
            },
          },
        ],
        patients: [
          {
            firstName: 'Nancy Ann',
            lastName: 'Doe',
            username: 'NancyAnn',
            uniqueId: '2512484916',
            links: {
              patient: 'http://localhost:3000/api/patients/1',
            },
          },
        ],
      },
    },
  ],
};

describe('CalendarService', () => {
  let calendarService: CalendarService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    calendarService = new CalendarService(httpClientSpy);
  });

  describe('list upcoming events', () => {
    it('should get upcoming events for user', async () => {
      httpClientSpy.get.and.returnValue(of(calendarResult));
      const responses = await calendarService.list(validUser);
      expect(httpClientSpy.get).toHaveBeenCalled();
      expect(responses.length).toEqual(1);
    });
  });

  it('should throw exception if user has no calendar link', async () => {
    httpClientSpy.get.and.returnValue(of(calendarResult));
    const userWithoutCalendarLink: User = {
      ...validUser,
      links: { ...validUser.links },
    };
    delete userWithoutCalendarLink.links.calendar;

    await expectAsync(
      calendarService.list(userWithoutCalendarLink)
    ).toBeRejectedWithError(TypeError);
  });
});
