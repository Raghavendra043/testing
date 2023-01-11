export const getSaturation = (baseUrl: any) => {
  return {
    name: 'Saturation (automatic)',
    version: '1.0',
    startNode: '107',
    endNode: '106',
    nodes: [
      {
        EndNode: {
          nodeName: '106',
        },
      },
      {
        SaturationDeviceNode: {
          nodeName: '107',
          next: 'ANSEV_106_D107',
          nextFail: 'AN_107_CANCEL',
          text: 'Please wait. Your saturation and pulse is being synchronized',
          origin: {
            name: '107.SAT#ORIGIN',
            type: 'Object',
          },
          saturation: {
            name: '107.SAT#SATURATION',
            type: 'Integer',
          },
          pulse: {
            name: '107.SAT#PULSE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_107_CANCEL',
          next: 'ANSEV_106_F107',
          variable: {
            name: '107.SAT##CANCEL',
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
          nodeName: 'ANSEV_106_F107',
          next: '106',
          variable: {
            name: '107.SAT##SEVERITY',
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
          nodeName: 'ANSEV_106_D107',
          next: '106',
          variable: {
            name: '107.SAT##SEVERITY',
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
        name: '107.SAT#ORIGIN',
        type: 'Object',
      },
      {
        name: '107.SAT#SATURATION',
        type: 'Integer',
      },
      {
        name: '107.SAT##SEVERITY',
        type: 'String',
      },
      {
        name: '107.SAT##CANCEL',
        type: 'Boolean',
      },
      {
        name: '107.SAT#PULSE',
        type: 'Integer',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/11`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/11/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
