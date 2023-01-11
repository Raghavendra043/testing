export const getActivity = (baseUrl: any) => {
  return {
    name: 'Activity (automatic)',
    version: '1.0',
    startNode: '99',
    endNode: '98',
    nodes: [
      {
        ActivityDeviceNode: {
          nodeName: '99',
          next: 'ANSEV_98_D99',
          nextFail: 'AN_99_CANCEL',
          text: 'Please wait. Your activity is being synchronized',
          origin: {
            name: '99.ACTIVITY#ORIGIN',
            type: 'Object',
          },
          dailySteps: {
            name: '99.ACTIVITY#DAILY_STEPS',
            type: 'Integer',
          },
          dailyStepsWeeklyAverage: {
            name: '99.ACTIVITY#DAILY_STEPS_WEEKLY_AVERAGE',
            type: 'Integer',
          },
          dailyStepsHistoricalMeasurements: {
            name: '99.ACTIVITY#DAILY_STEPS_HISTORICAL_MEASUREMENTS',
            type: 'Object[]',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_99_CANCEL',
          next: 'ANSEV_98_F99',
          variable: {
            name: '99.ACTIVITY##CANCEL',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: true,
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_98_F99',
          next: '98',
          variable: {
            name: '99.ACTIVITY##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ANSEV_98_D99',
          next: '98',
          variable: {
            name: '99.ACTIVITY##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        EndNode: {
          nodeName: '98',
        },
      },
    ],
    output: [
      {
        name: '99.ACTIVITY#ORIGIN',
        type: 'Object',
      },
      {
        name: '99.ACTIVITY#DAILY_STEPS_WEEKLY_AVERAGE',
        type: 'Integer',
      },
      {
        name: '99.ACTIVITY#DAILY_STEPS_HISTORICAL_MEASUREMENTS',
        type: 'Object[]',
      },
      {
        name: '99.ACTIVITY##CANCEL',
        type: 'Boolean',
      },
      {
        name: '99.ACTIVITY#DAILY_STEPS',
        type: 'Integer',
      },
      {
        name: '99.ACTIVITY##SEVERITY',
        type: 'String',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/10`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/10/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
