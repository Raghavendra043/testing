export const getSaturation = (baseUrl: any) => {
  const typeName = 'saturation';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '2014-11-09T09:14:00.000+01:00',
        type: typeName,
        severity: 'green',
        measurement: {
          unit: '%',
          value: 98,
        },
      },
      {
        timestamp: '2014-10-15T19:17:00.000+01:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          unit: '%',
          value: 95,
        },
      },
      {
        timestamp: '2014-09-25T23:11:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 99,
        },
      },
      {
        timestamp: '2014-08-22T12:24:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 95,
        },
      },
      {
        timestamp: '2014-07-04T17:35:00.000+01:00',
        type: typeName,
        severity: 'red',
        measurement: {
          unit: '%',
          value: 93,
        },
      },
      {
        timestamp: '2014-06-06T05:54:00.000+01:00',
        type: typeName,
        severity: 'red',
        measurement: {
          unit: '%',
          value: 85,
        },
      },
      {
        timestamp: '2013-10-13T06:35:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 89,
        },
      },
      {
        timestamp: '2012-09-07T14:46:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 87,
        },
      },
    ],
  };
};
