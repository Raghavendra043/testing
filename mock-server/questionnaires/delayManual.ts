export const getDelayManual = (baseUrl: any) => {
  return {
    name: 'Delay (manual)',
    version: '1.0',
    startNode: '89',
    endNode: '86',
    nodes: [
      {
        DelayNode: {
          nodeName: '90',
          countTime: 3,
          countUp: false,
          displayTextString: 'Do your best!',
          next: '92',
        },
      },
      {
        IONode: {
          nodeName: '89',
          elements: [
            {
              TextViewElement: {
                text: 'Exercise',
              },
            },
            {
              TextViewElement: {
                text: 'Sit and stand as many times as you can. The countdown will begin as you continue',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '90',
              },
            },
          ],
        },
      },
      {
        DelayNode: {
          nodeName: '87',
          countTime: 3,
          countUp: true,
          displayTextString: 'Do your best!',
          next: '88',
        },
      },
      {
        SitToStandManualDeviceNode: {
          nodeName: '92',
          next: 'ANSEV_91_D92',
          nextFail: 'AN_92_CANCEL',
          text: 'How many repetitions did you managed?',
          origin: {
            name: '92.SIT_TO_STAND#ORIGIN',
            type: 'Object',
          },
          sitToStand: {
            name: '92.SIT_TO_STAND',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_92_CANCEL',
          next: 'ANSEV_91_F92',
          variable: {
            name: '92.SIT_TO_STAND##CANCEL',
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
          nodeName: 'ANSEV_91_F92',
          next: '91',
          variable: {
            name: '92.SIT_TO_STAND##SEVERITY',
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
          nodeName: 'ANSEV_91_D92',
          next: '91',
          variable: {
            name: '92.SIT_TO_STAND##SEVERITY',
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
          nodeName: '86',
        },
      },
      {
        SitToStandManualDeviceNode: {
          nodeName: '88',
          next: 'ANSEV_86_D88',
          nextFail: 'AN_88_CANCEL',
          text: 'How many repetitions did you managed?',
          origin: {
            name: '88.SIT_TO_STAND#ORIGIN',
            type: 'Object',
          },
          sitToStand: {
            name: '88.SIT_TO_STAND',
            type: 'Integer',
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_88_CANCEL',
          next: 'ANSEV_86_F88',
          variable: {
            name: '88.SIT_TO_STAND##CANCEL',
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
          nodeName: 'ANSEV_86_F88',
          next: '86',
          variable: {
            name: '88.SIT_TO_STAND##SEVERITY',
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
          nodeName: 'ANSEV_86_D88',
          next: '86',
          variable: {
            name: '88.SIT_TO_STAND##SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        IONode: {
          nodeName: '91',
          elements: [
            {
              TextViewElement: {
                text: 'Exercise',
              },
            },
            {
              TextViewElement: {
                text: 'Sit and stand as many times as you can. The count will begin as you continue',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '87',
              },
            },
          ],
        },
      },
    ],
    output: [
      {
        name: '92.SIT_TO_STAND#ORIGIN',
        type: 'Object',
      },
      {
        name: '92.SIT_TO_STAND',
        type: 'Integer',
      },
      {
        name: '88.SIT_TO_STAND',
        type: 'Integer',
      },
      {
        name: '92.SIT_TO_STAND##CANCEL',
        type: 'Boolean',
      },
      {
        name: '88.SIT_TO_STAND#ORIGIN',
        type: 'Object',
      },
      {
        name: '88.SIT_TO_STAND##CANCEL',
        type: 'Boolean',
      },
      {
        name: '92.SIT_TO_STAND##SEVERITY',
        type: 'String',
      },
      {
        name: '88.SIT_TO_STAND##SEVERITY',
        type: 'String',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/8`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/8/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
