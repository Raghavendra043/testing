export const getSpirometry = (baseUrl: any) => {
  return {
    name: 'Spirometry (automatic)',
    version: '1.0',
    startNode: '109',
    endNode: '108',
    nodes: [
      {
        EndNode: {
          nodeName: '108',
        },
      },
      {
        SpirometerDeviceNode: {
          nodeName: '109',
          next: 'ANSEV_108_D109',
          nextFail: 'AN_109_CANCEL',
          text: 'Please wait. Your spirometry data is being synchronized',
          origin: {
            name: '109.SPI#ORIGIN',
            type: 'Object',
          },
          fev1: {
            name: '109.SPI#FEV1',
            type: 'Float',
          },
          fev6: {
            name: '109.SPI#FEV6',
            type: 'Float',
          },
          fev1Fev6Ratio: {
            name: '109.SPI#FEV1_FEV6_RATIO',
            type: 'Integer',
          },
          fef2575: {
            name: '109.SPI#FEF25_75',
            type: 'Float',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_109_CANCEL',
          next: 'ANSEV_108_F109',
          variable: {
            name: '109.SPI##CANCEL',
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
          nodeName: 'ANSEV_108_F109',
          next: '108',
          variable: {
            name: '109.SPI##SEVERITY',
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
          nodeName: 'ANSEV_108_D109',
          next: '108',
          variable: {
            name: '109.SPI##SEVERITY',
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
        name: '109.SPI#ORIGIN',
        type: 'Object',
      },
      {
        name: '109.SPI##SEVERITY',
        type: 'String',
      },
      {
        name: '109.SPI#FEV6',
        type: 'Float',
      },
      {
        name: '109.SPI#FEF25_75',
        type: 'Float',
      },
      {
        name: '109.SPI##CANCEL',
        type: 'Boolean',
      },
      {
        name: '109.SPI#FEV1',
        type: 'Float',
      },
      {
        name: '109.SPI#FEV1_FEV6_RATIO',
        type: 'Integer',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/12`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/12/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
