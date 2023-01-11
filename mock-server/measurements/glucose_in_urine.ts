export const getGlucoseInUrine = (baseUrl: any) => {
  const typeName = 'glucose_in_urine';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/memeasurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '2014-11-09T14:28:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'mmol/L',
          value: '+1',
        },
      },
      {
        timestamp: '2014-10-21T09:39:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'mmol/L',
          value: '+4',
        },
      },
      {
        timestamp: '2014-09-06T11:01:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'mmol/L',
          value: '+1',
        },
      },
      {
        timestamp: '2014-07-11T12:55:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'mmol/L',
          value: '+1',
        },
      },
      {
        timestamp: '2014-04-11T12:51:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'mmol/L',
          value: '+3',
        },
      },
    ],
  };
};
