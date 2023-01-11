export const getPulse = (baseUrl: any) => {
  const typeName = 'pulse';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '2014-11-11T15:34:00.000+02:00',
        type: typeName,
        severity: 'green',
        measurement: {
          unit: 'bpm',
          value: 53,
        },
      },
      {
        timestamp: '2014-11-08T05:03:00.000+02:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          unit: 'bpm',
          value: 55,
        },
      },
      {
        timestamp: '2014-11-06T12:34:00.000+02:00',
        type: typeName,
        measurement: {
          unit: 'bpm',
          value: 56,
        },
      },
      {
        timestamp: '2014-10-19T22:11:00.000+02:00',
        type: typeName,
        severity: 'red',
        measurement: {
          unit: 'bpm',
          value: 62,
        },
      },
      {
        timestamp: '2014-09-19T08:31:00.000+02:00',
        type: typeName,
        measurement: {
          unit: 'bpm',
          value: 67,
        },
      },
      {
        timestamp: '2014-08-19T10:23:00.000+02:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          unit: 'bpm',
          value: 72,
        },
      },
      {
        timestamp: '2014-07-19T09:47:00.000+02:00',
        type: typeName,
        measurement: {
          unit: 'bpm',
          value: 77,
        },
      },
      {
        timestamp: '2014-06-19T15:15:00.000+02:00',
        type: typeName,
        measurement: {
          unit: 'bpm',
          value: 88,
        },
      },
      {
        timestamp: '2014-05-19T23:54:00.000+02:00',
        type: typeName,
        measurement: {
          unit: 'bpm',
          value: 82,
        },
      },
      {
        timestamp: '2014-04-19T17:38:00.000+02:00',
        type: typeName,
        measurement: {
          unit: 'bpm',
          value: 75,
        },
      },
      {
        timestamp: '2014-03-19T10:29:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'bpm',
          value: 70,
        },
      },
      {
        timestamp: '2014-02-19T03:44:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'bpm',
          value: 63,
        },
      },
      {
        timestamp: '2014-01-19T07:25:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'bpm',
          value: 56,
        },
      },
      {
        timestamp: '2013-12-19T05:53:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'bpm',
          value: 52,
        },
      },
      {
        timestamp: '2012-12-19T21:23:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'bpm',
          value: 47,
        },
      },
    ],
  };
};
