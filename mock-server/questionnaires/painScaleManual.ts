export const getPainScaleManual = (baseUrl: any) => {
  return {
    name: 'Pain scale (manual)',
    version: '1.0',
    startNode: '59',
    endNode: '58',
    nodes: [
      {
        PainScaleManualDeviceNode: {
          nodeName: '59',
          next: 'ANSEV_58_D59',
          nextFail: 'AN_59_CANCEL',
          text: 'How are you feeling today?',
          origin: {
            name: '59.PAIN_SCALE#ORIGIN',
            type: 'Object',
          },
          painScale: {
            name: '59.PAIN_SCALE',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_59_CANCEL',
          next: 'ANSEV_58_F59',
          variable: {
            name: '59.PAIN_SCALE##CANCEL',
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
          nodeName: 'ANSEV_58_F59',
          next: '58',
          variable: {
            name: '59.PAIN_SCALE##SEVERITY',
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
          nodeName: 'ANSEV_58_D59',
          next: '58',
          variable: {
            name: '59.PAIN_SCALE##SEVERITY',
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
          nodeName: '58',
        },
      },
    ],
    output: [
      {
        name: '59.PAIN_SCALE##CANCEL',
        type: 'Boolean',
      },
      {
        name: '59.PAIN_SCALE',
        type: 'Float',
      },
      {
        name: '59.PAIN_SCALE#ORIGIN',
        type: 'Object',
      },
      {
        name: '59.PAIN_SCALE##SEVERITY',
        type: 'String',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/5`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/5/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
