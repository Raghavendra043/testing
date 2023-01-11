export const getPainScale = (baseUrl: any) => {
  const typeName = 'pain_scale';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '2016-01-27T16:06:38.000+01:00',
        type: typeName,
        measurement: {
          unit: '-',
          value: 7,
        },
      },
    ],
  };
};
