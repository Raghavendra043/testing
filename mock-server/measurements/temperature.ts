export const getTemperature = (baseUrl: any) => {
  const typeName = 'temperature';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '2014-11-07T14:28:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '°C',
          value: 37.7,
        },
      },
      {
        timestamp: '2014-10-25T09:39:00.000+01:00',
        type: typeName,
        measurement: {
          unit: '°C',
          value: 39.1,
        },
      },
    ],
  };
};
