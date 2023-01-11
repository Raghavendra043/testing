export const getBloodPressure = (baseUrl: any) => {
  const typeName = 'blood_pressure';

  return {
    total: 15,
    max: 10,
    offset: 0,
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
      next: `${baseUrl}/clinician/api/patients/me/measurements_more_blood_pressure`,
    },
    results: [
      {
        timestamp: '2014-11-11T15:35:00.000+02:00',
        type: typeName,
        severity: 'red',
        measurement: {
          unit: 'mmHg',
          systolic: 120,
          diastolic: 90,
        },
      },
      {
        timestamp: '2014-11-08T05:03:00.000+02:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          unit: 'mmHg',
          systolic: 153,
          diastolic: 100,
        },
      },
      {
        timestamp: '2014-11-06T06:27:00.000+02:00',
        type: typeName,
        severity: 'green',
        measurement: {
          unit: 'mmHg',
          systolic: 174,
          diastolic: 120,
        },
      },
      {
        timestamp: '2014-10-19T22:11:00.000+02:00',
        type: typeName,
        measurement: {
          unit: 'mmHg',
          systolic: 213,
          diastolic: 160,
        },
      },
      {
        timestamp: '2014-09-19T11:45:00.000+02:00',
        type: typeName,
        severity: 'none',
        measurement: {
          unit: 'mmHg',
          systolic: 190,
          diastolic: 130,
        },
      },
      {
        timestamp: '2014-08-19T05:21:00.000+02:00',
        type: typeName,
        measurement: {
          unit: 'mmHg',
          systolic: 160,
          diastolic: 105,
        },
      },
      {
        timestamp: '2014-07-19T09:47:00.000+02:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          unit: 'mmHg',
          systolic: 150,
          diastolic: 100,
        },
      },
      {
        timestamp: '2014-06-19T15:15:00.000+02:00',
        type: typeName,
        measurement: {
          unit: 'mmHg',
          systolic: 130,
          diastolic: 93,
        },
      },
      {
        timestamp: '2014-05-19T23:54:00.000+02:00',
        type: typeName,
        measurement: {
          unit: 'mmHg',
          systolic: 120,
          diastolic: 88,
        },
      },
      {
        timestamp: '2014-04-19T00:00:00.000+02:00',
        type: typeName,
        measurement: {
          unit: 'mmHg',
          systolic: 110,
          diastolic: 85,
        },
      },
    ],
  };
};
// export default get;
