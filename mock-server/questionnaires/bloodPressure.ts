export const getBloodPressure = (baseUrl: any) => {
  return {
    name: 'Blood pressure (automatic)',
    version: '1.0',
    startNode: '101',
    endNode: '100',
    nodes: [
      {
        BloodPressureDeviceNode: {
          nodeName: '101',
          next: 'ANSEV_100_D101',
          nextFail: 'AN_101_CANCEL',
          text: 'Please wait. Your blood pressure and pulse is being synchronized',
          helpText:
            'This is a left text<div style="text-align: center;">This is a center text</div><div style="text-align: right;">This is a right text</div><div style="text-align: left;"><br></div><b>This seems to work</b>',
          helpImage: 'http://localhost:7000/clinician/api/help-texts/1/image',
          origin: {
            name: '101.BP#ORIGIN',
            type: 'Object',
          },
          systolic: {
            name: '101.BP#SYSTOLIC',
            type: 'Integer',
          },
          diastolic: {
            name: '101.BP#DIASTOLIC',
            type: 'Integer',
          },
          meanArterialPressure: {
            name: '101.BP#MEAN_ARTERIAL_PRESSURE',
            type: 'Integer',
          },
          pulse: {
            name: '101.BP#PULSE',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_101_CANCEL',
          next: 'ANSEV_100_F101',
          variable: {
            name: '101.BP##CANCEL',
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
          nodeName: 'ANSEV_100_F101',
          next: '100',
          variable: {
            name: '101.BP##SEVERITY',
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
          nodeName: 'ANSEV_100_D101',
          next: '100',
          variable: {
            name: '101.BP##SEVERITY',
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
          nodeName: '100',
        },
      },
    ],
    output: [
      {
        name: '101.BP#ORIGIN',
        type: 'Object',
      },
      {
        name: '101.BP#PULSE',
        type: 'Integer',
      },
      {
        name: '101.BP#DIASTOLIC',
        type: 'Integer',
      },
      {
        name: '101.BP#MEAN_ARTERIAL_PRESSURE',
        type: 'Integer',
      },
      {
        name: '101.BP#SYSTOLIC',
        type: 'Integer',
      },
      {
        name: '101.BP##CANCEL',
        type: 'Boolean',
      },
      {
        name: '101.BP##SEVERITY',
        type: 'String',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/4`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/4/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
