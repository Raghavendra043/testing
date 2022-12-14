export const getBloodSugar = (baseUrl: any) => {
  const typeName = 'bloodsugar';

  return {
    links: {
      self: `${baseUrl}/clinician/api/patients/me/measurements?type=${typeName}`,
    },
    results: [
      {
        timestamp: '2014-11-09T16:43:00.000+01:00',
        type: typeName,
        severity: 'red',
        comment: "I couldn't stop eating cake",
        measurement: {
          value: 3.4,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: true,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-11-09T09:14:00.000+01:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          value: 5.4,
          unit: 'mmol/L',
          isAfterMeal: true,
          isBeforeMeal: false,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-11-09T06:35:00.000+01:00',
        type: typeName,
        severity: 'red',
        measurement: {
          value: null,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: true,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-11-07T14:15:00.000+01:00',
        type: typeName,
        measurement: {
          value: 8.7,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: false,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-11-01T05:36:00.000+01:00',
        type: typeName,
        measurement: {
          value: 3.5,
          unit: 'mmol/L',
          isAfterMeal: true,
          isBeforeMeal: false,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-10-27T17:02:00.000+01:00',
        type: typeName,
        measurement: {
          value: 13.4,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: true,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-10-16T23:52:00.000+01:00',
        type: typeName,
        measurement: {
          value: 10.2,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: true,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-10-02T16:37:00.000+01:00',
        type: typeName,
        severity: 'yellow',
        measurement: {
          value: 2.9,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: false,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-10-02T18:18:00.000+01:00',
        type: typeName,
        severity: 'red',
        measurement: {
          value: 10.2,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: false,
          isFasting: true,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-08-05T04:37:00.000+01:00',
        type: typeName,
        measurement: {
          value: 5.6,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: true,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-07-07T07:07:00.000+01:00',
        type: typeName,
        severity: 'red',
        measurement: {
          value: 3.7,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: false,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-06-01T05:34:00.000+01:00',
        type: typeName,
        measurement: {
          value: 5.9,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: false,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-05-15T03:37:00.000+01:00',
        type: typeName,
        measurement: {
          value: 7.7,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: false,
          isFasting: true,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
      {
        timestamp: '2014-04-06T20:23:00.000+01:00',
        type: typeName,
        severity: 'red',
        measurement: {
          value: 6.3,
          unit: 'mmol/L',
          isAfterMeal: false,
          isBeforeMeal: true,
          isFasting: false,
          isControlMeasurement: false,
          isOutOfBounds: false,
          otherInformation: '',
          hasTemperatureWarning: false,
        },
      },
    ],
  };
};
