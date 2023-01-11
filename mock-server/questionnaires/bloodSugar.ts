export const getBloodSugar = (baseUrl: any) => {
  return {
    name: 'Blood sugar (automatic)',
    version: '1.0',
    startNode: '103',
    endNode: '102',
    nodes: [
      {
        EndNode: {
          nodeName: '102',
        },
      },
      {
        BloodSugarDeviceNode: {
          nodeName: '103',
          next: 'ANSEV_102_D103',
          nextFail: 'AN_103_CANCEL',
          text: 'Please wait. Your blood sugar is being synchronized',
          origin: {
            name: '103.BS#ORIGIN',
            type: 'Object',
          },
          bloodSugarMeasurements: {
            name: '103.BS#BLOODSUGARMEASUREMENTS',
            type: 'Object[]',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_103_CANCEL',
          next: 'ANSEV_102_F103',
          variable: {
            name: '103.BS##CANCEL',
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
          nodeName: 'ANSEV_102_F103',
          next: '102',
          variable: {
            name: '103.BS##SEVERITY',
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
          nodeName: 'ANSEV_102_D103',
          next: '102',
          variable: {
            name: '103.BS##SEVERITY',
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
        name: '103.BS#ORIGIN',
        type: 'Object',
      },
      {
        name: '103.BS##CANCEL',
        type: 'Boolean',
      },
      {
        name: '103.BS#BLOODSUGARMEASUREMENTS',
        type: 'Object[]',
      },
      {
        name: '103.BS##SEVERITY',
        type: 'String',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/2`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/2/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
