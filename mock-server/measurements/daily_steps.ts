export const getDailySteps = (baseUrl: any) => {
  const typeName = 'daily_steps';

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
          unit: 'step count',
          value: 9000,
        },
      },
      {
        timestamp: '2014-10-15T19:17:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'step count',
          value: 8500,
        },
      },
      {
        timestamp: '2014-09-25T23:11:00.000+01:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          unit: 'step count',
          value: 12345,
        },
      },
      {
        timestamp: '2014-08-22T12:24:00.000+01:00',
        type: typeName,
        comment: "I didn't feel like walking",
        measurement: {
          unit: 'step count',
          value: 3535,
        },
      },
    ],
  };
};
