export const getTemperature = (baseUrl: any) => {
  return {
    name: 'Temperature (automatic)',
    version: '1.0',
    startNode: '111',
    endNode: '110',
    nodes: [
      {
        EndNode: {
          nodeName: '110',
        },
      },
      {
        TemperatureDeviceNode: {
          nodeName: '111',
          next: 'ANSEV_110_D111',
          nextFail: 'AN_111_CANCEL',
          text: 'Please wait. Your temperature is being synchronized',
          origin: {
            name: '111.TEMPERATURE#ORIGIN',
            type: 'Object',
          },
          temperature: {
            name: '111.TEMPERATURE',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_111_CANCEL',
          next: 'ANSEV_110_F111',
          variable: {
            name: '111.TEMPERATURE##CANCEL',
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
          nodeName: 'ANSEV_110_F111',
          next: '110',
          variable: {
            name: '111.TEMPERATURE##SEVERITY',
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
          nodeName: 'ANSEV_110_D111',
          next: '110',
          variable: {
            name: '111.TEMPERATURE##SEVERITY',
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
        name: '111.TEMPERATURE#ORIGIN',
        type: 'Object',
      },
      {
        name: '111.TEMPERATURE',
        type: 'Float',
      },
      {
        name: '111.TEMPERATURE##SEVERITY',
        type: 'String',
      },
      {
        name: '111.TEMPERATURE##CANCEL',
        type: 'Boolean',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/13`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/13/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
