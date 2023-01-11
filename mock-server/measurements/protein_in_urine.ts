export const getProteinInUrine = (baseUrl: any) => {
  const typeName = 'protein_in_urine';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '2014-11-07T14:28:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'g/L',
          value: 'Neg.',
        },
      },
      {
        timestamp: '2014-10-25T09:39:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'g/L',
          value: 'Neg.',
        },
      },
      {
        timestamp: '2014-09-08T11:01:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'g/L',
          value: '+/-',
        },
      },
      {
        timestamp: '2014-06-11T12:55:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'g/L',
          value: '+/-',
        },
      },
      {
        timestamp: '2014-04-11T12:51:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'g/L',
          value: 'Neg.',
        },
      },
      {
        timestamp: '2013-12-20T08:48:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'g/L',
          value: '+/-',
        },
      },
      {
        timestamp: '2013-11-07T10:22:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'g/L',
          value: '+2',
        },
      },
    ],
  };
};
