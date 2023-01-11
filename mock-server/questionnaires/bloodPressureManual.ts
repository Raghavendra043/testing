export const getBloodPressureManual = (baseUrl: any) => {
  return {
    name: 'Blood pressure (manual)',
    version: '1.0',
    startNode: '56',
    endNode: '55',
    nodes: [
      {
        IONode: {
          nodeName: '56',
          elements: [
            {
              TextViewElement: {
                text: 'Blood pressure and pulse',
              },
            },
            {
              TextViewElement: {
                text: 'Blood pressure and pulse will now be measured!',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '57',
              },
            },
          ],
        },
      },
      {
        BloodPressureManualDeviceNode: {
          nodeName: '57',
          next: 'ANSEV_55_D57',
          nextFail: 'AN_57_CANCEL',
          text: 'Measure your blood pressure and enter the values below',
          origin: {
            name: '57.BP#ORIGIN',
            type: 'Object',
          },
          systolic: {
            name: '57.BP#SYSTOLIC',
            type: 'Integer',
            range: {
              min: 60,
              max: 250,
            },
          },
          diastolic: {
            name: '57.BP#DIASTOLIC',
            type: 'Integer',
            range: {
              min: 40,
              max: 150,
            },
          },
          meanArterialPressure: {
            name: '57.BP#MEAN_ARTERIAL_PRESSURE',
            type: 'Integer',
          },
          pulse: {
            name: '57.BP#PULSE',
            type: 'Integer',
            range: {
              min: 30,
              max: 200,
            },
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_57_CANCEL',
          next: 'ANSEV_55_F57',
          variable: {
            name: '57.BP##CANCEL',
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
          nodeName: 'ANSEV_55_F57',
          next: '55',
          variable: {
            name: '57.BP##SEVERITY',
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
          nodeName: 'ANSEV_55_D57',
          next: '55',
          variable: {
            name: '57.BP##SEVERITY',
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
          nodeName: '55',
        },
      },
    ],
    output: [
      {
        name: '57.BP##CANCEL',
        type: 'Boolean',
      },
      {
        name: '57.BP#ORIGIN',
        type: 'Object',
      },
      {
        name: '57.BP#SYSTOLIC',
        type: 'Integer',
      },
      {
        name: '57.BP#PULSE',
        type: 'Integer',
      },
      {
        name: '57.BP#DIASTOLIC',
        type: 'Integer',
      },
      {
        name: '57.BP#MEAN_ARTERIAL_PRESSURE',
        type: 'Integer',
      },
      {
        name: '57.BP##SEVERITY',
        type: 'String',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/3`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/3/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
