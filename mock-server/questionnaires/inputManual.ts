export const getInputManual = (baseUrl: any) => {
  return {
    name: 'Input (manual)',
    version: '1.0',
    startNode: '97',
    endNode: '93',
    nodes: [
      {
        IONode: {
          nodeName: '94',
          elements: [
            {
              TextViewElement: {
                text: 'Are you okay?',
              },
            },
            {
              TwoButtonElement: {
                leftText: 'NO',
                leftNext: 'AN_93_L94',
                rightText: 'YES',
                rightNext: 'AN_93_R94',
              },
            },
          ],
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_93_R94',
          next: '93',
          variable: {
            name: '94.FIELD',
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
          nodeName: 'AN_93_L94',
          next: '93',
          variable: {
            name: '94.FIELD',
            type: 'Boolean',
          },
          expression: {
            type: 'Boolean',
            value: false,
          },
        },
      },
      {
        IONode: {
          nodeName: '95',
          elements: [
            {
              TextViewElement: {
                text: 'What is your favourite quote?',
              },
            },
            {
              EditTextElement: {
                outputVariable: {
                  name: '95.FIELD',
                  type: 'String',
                },
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '94',
              },
            },
          ],
          next: '94',
        },
      },
      {
        EndNode: {
          nodeName: '93',
        },
      },
      {
        IONode: {
          nodeName: '96',
          elements: [
            {
              TextViewElement: {
                text: 'What is your favourite number?',
              },
            },
            {
              EditTextElement: {
                outputVariable: {
                  name: '96.FIELD',
                  type: 'Integer',
                },
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '95',
              },
            },
          ],
          next: '95',
        },
      },
      {
        IONode: {
          nodeName: '97',
          elements: [
            {
              TextViewElement: {
                text: 'What is your favourite decimal?',
              },
            },
            {
              EditTextElement: {
                outputVariable: {
                  name: '97.FIELD',
                  type: 'Float',
                },
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '96',
              },
            },
          ],
          next: '96',
        },
      },
    ],
    output: [
      {
        name: '95.FIELD',
        type: 'String',
      },
      {
        name: '94.FIELD',
        type: 'Boolean',
      },
      {
        name: '96.FIELD',
        type: 'Integer',
      },
      {
        name: '97.FIELD',
        type: 'Float',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/9`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/9/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
