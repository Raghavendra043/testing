export const getEcg = (baseUrl: any) => {
  return {
    name: 'ECG (automatic)',
    version: '1.0',
    startNode: '115',
    endNode: '114',
    nodes: [
      {
        EcgDeviceNode: {
          nodeName: '115',
          next: 'ANSEV_114_D115',
          nextFail: 'AN_115_CANCEL',
          text: 'Please wait. Your ECG is being synchronized',
          sampleTimeInSeconds: 180,
          origin: {
            name: '115.ECG#ORIGIN',
            type: 'Object',
          },
          startTime: {
            name: '115.ECG#START_TIME',
            type: 'String',
          },
          duration: {
            name: '115.ECG#DURATION',
            type: 'Object',
          },
          frequency: {
            name: '115.ECG#FREQUENCY',
            type: 'Object',
          },
          rrIntervals: {
            name: '115.ECG#RR_INTERVALS',
            type: 'Object',
          },
          samples: {
            name: '115.ECG#SAMPLES',
            type: 'Object',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_115_CANCEL',
          next: 'ANSEV_114_F115',
          variable: {
            name: '115.ECG##CANCEL',
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
          nodeName: 'ANSEV_114_F115',
          next: '114',
          variable: {
            name: '115.ECG##SEVERITY',
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
          nodeName: 'ANSEV_114_D115',
          next: '114',
          variable: {
            name: '115.ECG##SEVERITY',
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
          nodeName: '114',
        },
      },
    ],
    output: [
      {
        name: '115.ECG#START_TIME',
        type: 'Integer',
      },
      {
        name: '115.ECG#DURATION',
        type: 'Object',
      },
      {
        name: '115.ECG#FREQUENCY',
        type: 'Object',
      },
      {
        name: '115.ECG#RR_INTERVALS',
        type: 'Object',
      },
      {
        name: '115.ECG#SAMPLES',
        type: 'Object',
      },
      {
        name: '115.ECG#ORIGIN',
        type: 'Object',
      },
      {
        name: '115.ECG##SEVERITY',
        type: 'String',
      },
      {
        name: '115.ECG##CANCEL',
        type: 'Boolean',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/14`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/14/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
