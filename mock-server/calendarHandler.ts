import { username } from './utils';

// Data

const calendarEvents = (baseUrl: any) => {
  const events = [
    {
      description: 'Weekly meeting',
      type: 'individual_session',
      links: {
        origin: `${baseUrl}/meetings/individual-sessions/1`,
        event: `${baseUrl}/calendar/events/1`,
      },
      schedule: {
        startTime: '2019-03-21T12:00:00+01:00',
      },
      party: {
        clinicians: [
          {
            email: 'helen@example.com',
            firstName: 'Helen',
            lastName: 'Anderson',
            username: 'HelenAnderson',
            links: {
              clinician: `${baseUrl}/clinician/api/clinicians/1`,
            },
          },
        ],
        patients: [
          {
            uniqueId: '2512484916',
            firstName: 'Nancy Ann',
            lastName: 'Doe',
            username: 'NancyAnn',
            links: {
              patient: `${baseUrl}/clinician/api/patients/1`,
            },
          },
        ],
      },
    },
    {
      description: 'Later meeting',
      type: 'individual_session',
      links: {
        origin: `${baseUrl}/meetings/individual-sessions/1`,
        event: `${baseUrl}/calendar/events/1`,
      },
      schedule: {
        startTime: '2019-03-21T17:00:00+01:00',
      },
      party: {
        clinicians: [
          {
            email: 'helen@example.com',
            firstName: 'Helen',
            lastName: 'Anderson',
            username: 'HelenAnderson',
            links: {
              clinician: `${baseUrl}/clinician/api/clinicians/1`,
            },
          },
        ],
        patients: [
          {
            uniqueId: '2512484916',
            firstName: 'Nancy Ann',
            lastName: 'Doe',
            username: 'NancyAnn',
            links: {
              patient: `${baseUrl}/clinician/api/patients/1`,
            },
          },
        ],
      },
    },
    {
      description: 'Other meeting',
      type: 'individual_session',
      links: {
        origin: `${baseUrl}/meetings/individual-sessions/1`,
        event: `${baseUrl}/calendar/events/1`,
      },
      schedule: {
        startTime: '2019-04-27T12:00:00+01:00',
      },
      party: {
        clinicians: [
          {
            email: 'helen@example.com',
            firstName: 'Helen',
            lastName: 'Anderson',
            username: 'HelenAnderson',
            links: {
              clinician: `${baseUrl}/clinician/api/clinicians/1`,
            },
          },
        ],
        patients: [
          {
            uniqueId: '2512484916',
            firstName: 'Nancy Ann',
            lastName: 'Doe',
            username: 'NancyAnn',
            links: {
              patient: `${baseUrl}/clinician/api/patients/1`,
            },
          },
        ],
      },
    },
  ];

  return {
    results: events,
    links: {
      self: baseUrl + 'calendar',
    },
  };
};

// API

export const list = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Calendar events list requested from: ${_username}`);

  if (_username === 'calendarNoRecipients') {
    res.send([]);
    console.log('Empty calendar events list returned');
    return;
  }

  console.log('Calendar events returned.');
  res.send(calendarEvents(baseUrl));
};
