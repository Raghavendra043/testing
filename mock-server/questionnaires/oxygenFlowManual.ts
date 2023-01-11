export const getOxygenFlowManual = (baseUrl: any) => {
  return {
    name: 'Oxygen Flow Manuel',
    version: '2.0',
    startNode: '88',
    endNode: '87',
    nodes: [
      {
        OxygenFlowManualDeviceNode: {
          nodeName: '88',
          next: 'ANSEV_87_D88',
          nextFail: 'AN_88_CANCEL',
          text: 'Please enter your oxygen flow',
          origin: {
            name: '88.OXYGEN_FLOW#ORIGIN',
            type: 'Object',
          },
          oxygenFlow: {
            name: '88.OXYGEN_FLOW',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_88_CANCEL',
          next: 'ANSEV_87_F88',
          variable: {
            name: '88.OXYGEN_FLOW##CANCEL',
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
          nodeName: 'ANSEV_87_F88',
          next: '87',
          variable: {
            name: '88.OXYGEN_FLOW##SEVERITY',
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
          nodeName: 'ANSEV_87_D88',
          next: '87',
          variable: {
            name: '88.OXYGEN_FLOW##SEVERITY',
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
          nodeName: '87',
        },
      },
    ],
    output: [
      {
        name: '88.OXYGEN_FLOW',
        type: 'Float',
      },
      {
        name: '88.OXYGEN_FLOW#ORIGIN',
        type: 'Object',
      },
      {
        name: '88.OXYGEN_FLOW##SEVERITY',
        type: 'String',
      },
      {
        name: '88.OXYGEN_FLOW##CANCEL',
        type: 'Boolean',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/20`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/20/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
