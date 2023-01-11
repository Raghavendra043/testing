export const getFev6 = (baseUrl: any) => {
  const typeName = 'fev6';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '2014-11-09T09:14:00.000+01:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          unit: 'L',
          value: 2.2,
        },
      },
      {
        timestamp: '2014-10-15T19:17:00.000+01:00',
        type: typeName,
        severity: 'red',
        measurement: {
          unit: 'L',
          value: 1.3,
        },
      },
      {
        timestamp: '2014-09-25T23:11:00.000+01:00',
        type: typeName,
        severity: 'green',
        measurement: {
          unit: 'L',
          value: 4.3,
        },
      },
      {
        timestamp: '2014-08-22T12:24:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'L',
          value: 3.2,
        },
      },
      {
        timestamp: '2014-07-04T17:35:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'L',
          value: 7.5,
        },
      },
      {
        timestamp: '2014-06-06T05:54:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'L',
          value: 3.2,
        },
      },
    ],
  };
};
