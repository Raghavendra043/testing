export const getFev1_6 = (baseUrl: any) => {
  const typeName = 'fev1_fev6_ratio';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=fev1_fev6_ratio`,
    },
    results: [
      {
        timestamp: '2014-11-09T09:14:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 80.5,
        },
      },
      {
        timestamp: '2014-10-15T19:17:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 81.3,
        },
      },
      {
        timestamp: '2014-09-25T23:11:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 84.3,
        },
      },
      {
        timestamp: '2014-08-22T12:24:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 83.2,
        },
      },
      {
        timestamp: '2014-07-04T17:35:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 87.5,
        },
      },
      {
        timestamp: '2014-06-06T05:54:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 83.2,
        },
      },
      {
        timestamp: '2013-10-13T06:35:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 84.8,
        },
      },
      {
        timestamp: '2012-09-07T14:46:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '%',
          value: 83.0,
        },
      },
    ],
  };
};
