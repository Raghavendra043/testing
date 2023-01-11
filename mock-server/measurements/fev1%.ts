export const getFev1Percentage = (baseUrl: any) => {
  const typeName = 'fev1_percentage';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '2014-11-09T09:14:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 123,
        },
      },
      {
        timestamp: '2014-10-15T19:17:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 85,
        },
      },
      {
        timestamp: '2014-09-25T23:11:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 83,
        },
      },
      {
        timestamp: '2014-08-22T12:24:00.000+01:00',
        type: typeName,
        severity: 'red',
        measurement: {
          unit: '%',
          value: 80,
        },
      },
      {
        timestamp: '2014-07-04T17:35:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 84,
        },
      },
      {
        timestamp: '2014-06-06T05:54:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 87,
        },
      },
    ],
  };
};
