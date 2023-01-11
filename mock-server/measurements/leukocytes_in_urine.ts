export const getLeukocytesInUrine = (baseUrl: any) => {
  const typeName = 'leukocytes_in_urine';

  return {
    results: [
      {
        timestamp: '2016-01-29T10:26:31.000+01:00',
        type: typeName,
        measurement: {
          unit: 'Leu/µL',
          value: '+1',
        },
      },
      {
        timestamp: '2016-01-29T10:26:31.000+01:00',
        type: typeName,
        measurement: {
          unit: 'Leu/µL',
          value: '+1',
        },
      },
      {
        timestamp: '2016-01-27T16:06:38.000+01:00',
        type: typeName,
        measurement: {
          unit: 'Leu/µL',
          value: '+3',
        },
      },
    ],
    total: 3,
    max: 100,
    offset: 0,
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
  };
};
