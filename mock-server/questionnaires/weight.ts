export const getWeight = (baseUrl: any) => {
  return {
    name: 'Weight (automatic)',
    version: '1.0',
    startNode: '113',
    endNode: '112',
    nodes: [
      {
        EndNode: {
          nodeName: '112',
        },
      },
      {
        WeightDeviceNode: {
          nodeName: '113',
          next: 'ANSEV_112_D113',
          nextFail: 'AN_113_CANCEL',
          text: 'Please wait. Your weight is being synchronized',
          origin: {
            name: '113.WEIGHT#ORIGIN',
            type: 'Object',
          },
          weight: {
            name: '113.WEIGHT',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_113_CANCEL',
          next: 'ANSEV_112_F113',
          variable: {
            name: '113.WEIGHT##CANCEL',
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
          nodeName: 'ANSEV_112_F113',
          next: '112',
          variable: {
            name: '113.WEIGHT##SEVERITY',
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
          nodeName: 'ANSEV_112_D113',
          next: '112',
          variable: {
            name: '113.WEIGHT##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
    ],
    output: [
      {
        name: '113.WEIGHT##SEVERITY',
        type: 'String',
      },
      {
        name: '113.WEIGHT##CANCEL',
        type: 'Boolean',
      },
      {
        name: '113.WEIGHT',
        type: 'Float',
      },
      {
        name: '113.WEIGHT#ORIGIN',
        type: 'Object',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/7`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/7/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
