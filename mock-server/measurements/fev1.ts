export const getFev1 = (baseUrl: any) => {
  const typeName = 'fev1';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '2014-11-09T09:14:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'L',
          value: 3.3,
        },
      },
      {
        timestamp: '2014-10-15T19:17:00.000+01:00',
        type: typeName,
        severity: 'red',
        measurement: {
          unit: 'L',
          value: 2.7,
        },
      },
      {
        timestamp: '2014-09-25T23:11:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'L',
          value: 5.6,
        },
      },
      {
        timestamp: '2014-08-22T12:24:00.000+01:00',
        type: typeName,
        severity: 'green',
        measurement: {
          unit: 'L',
          value: 4.5,
        },
      },
      {
        timestamp: '2014-07-04T17:35:00.000+01:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          unit: 'L',
          value: 8.2,
        },
      },
      {
        timestamp: '2014-06-06T05:54:00.000+01:00',
        type: typeName,
        severity: 'none',
        measurement: {
          unit: 'L',
          value: 3.7,
        },
      },
      {
        timestamp: '2013-10-13T06:35:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'L',
          value: 6.1,
        },
      },
      {
        timestamp: '2012-09-07T14:46:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'L',
          value: 5.0,
        },
      },
    ],
  };
};
