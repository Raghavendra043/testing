export const getBloodSugarManual = (baseUrl: any) => {
  return {
    name: 'Blood sugar (manual) with help text',
    version: '1.0',
    startNode: '215',
    endNode: '214',
    nodes: [
      {
        IONode: {
          nodeName: '215',
          elements: [
            {
              TextViewElement: {
                text: 'Blood sugar',
              },
            },
            {
              HelpTextElement: {
                text: 'Help text',
                image: `${baseUrl}/clinician/api/help-texts/1/image`,
              },
            },
            {
              TextViewElement: {
                text: 'Blood sugar will now be measured!',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '216',
              },
            },
          ],
        },
      },
      {
        BloodSugarManualDeviceNode: {
          nodeName: '216',
          next: 'ANSEV_214_D216',
          nextFail: 'AN_216_CANCEL',
          text: 'Enter your blood sugar',
          helpText: 'I am Scott Malkison and I have diabetes.',
          helpImage: `${baseUrl}/clinician/api/help-texts/1/image`,
          origin: {
            name: '216.BS#ORIGIN',
            type: 'Object',
          },
          bloodSugarMeasurements: {
            name: '216.BS#BLOODSUGARMEASUREMENTS',
            type: 'Object[]',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_216_CANCEL',
          next: 'ANSEV_214_F216',
          variable: {
            name: '216.BS##CANCEL',
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
          nodeName: 'ANSEV_214_F216',
          next: '214',
          variable: {
            name: '216.BS##SEVERITY',
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
          nodeName: 'ANSEV_214_D216',
          next: '214',
          variable: {
            name: '216.BS##SEVERITY',
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
          nodeName: '214',
        },
      },
    ],
    output: [
      {
        name: '216.BS##CANCEL',
        type: 'Boolean',
      },
      {
        name: '216.BS#BLOODSUGARMEASUREMENTS',
        type: 'Object[]',
      },
      {
        name: '216.BS#ORIGIN',
        type: 'Object',
      },
      {
        name: '216.BS##SEVERITY',
        type: 'String',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/27`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/27/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
