export const getBodyCellMass = (baseUrl: any) => {
  const typeName = 'body_cell_mass';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '20190-09-09T09:14:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'kg',
          value: 56.0,
        },
      },
      {
        timestamp: '2019-08-25T19:17:00.000+01:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          unit: 'kg',
          value: 40.0,
        },
      },
      {
        timestamp: '2019-08-15T23:11:00.000+01:00',
        type: typeName,
        measurement: {
          unit: 'kg',
          value: 42.3,
        },
      },
      {
        timestamp: '2019-08-22T12:24:00.000+01:00',
        type: typeName,
        severity: 'red',
        measurement: {
          unit: 'kg',
          value: 50.0,
        },
      },
      {
        timestamp: '2019-07-04T17:35:00.000+01:00',
        type: typeName,
        severity: 'green',
        measurement: {
          unit: 'kg',
          value: 60.0,
        },
      },
    ],
  };
};
