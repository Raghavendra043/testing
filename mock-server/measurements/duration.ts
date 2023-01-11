export const getDuration = (baseUrl: any) => {
  const typeName = 'duration';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '2014-11-09T09:14:00.000+01:00',
        type: typeName,
        severity: 'red',
        measurement: {
          unit: 'min',
          value: 540,
        },
      },
      {
        timestamp: '2014-10-15T19:17:00.000+01:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          unit: 'min',
          value: 532,
        },
      },
      {
        timestamp: '2014-09-25T23:11:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'min',
          value: 450,
        },
      },
      {
        timestamp: '2014-08-22T12:24:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'min',
          value: 600,
        },
      },
    ],
  };
};
