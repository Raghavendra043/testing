export const getMultipleChoiceWithSummationAndBranch = (baseUrl: any) => {
  return {
    name: 'Multiple Choice (with summation and branching)',
    version: '1.0',
    startNode: '132',
    endNode: '127',
    nodes: [
      {
        IONode: {
          nodeName: '128',
          elements: [
            {
              TextViewElement: {
                text: 'Everything seems okay',
              },
            },
            {
              TextViewElement: {
                text: "You don't have to see a doctor",
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '127',
              },
            },
          ],
        },
      },
      {
        IONode: {
          nodeName: '130',
          elements: [
            {
              TextViewElement: {
                text: 'Not so good',
              },
            },
            {
              TextViewElement: {
                text: 'It is recommended for you to see a doctor and get your possible symptoms investigated',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '127',
              },
            },
          ],
        },
      },
      {
        MultipleChoiceQuestionNode: {
          nodeName: '133',
          question: 'How often do you sneeze?',
          next: '131',
          answer: {
            name: '133.MULTIPLE_CHOICE_QUESTION',
            type: 'Integer',
            choices: [
              {
                value: 3,
                text: 'All the time',
              },
              {
                value: 2,
                text: 'Most of the time',
              },
              {
                value: 1,
                text: 'Sometimes',
              },
            ],
          },
        },
      },
      {
        MultipleChoiceQuestionNode: {
          nodeName: '132',
          question: 'How often do you scratch your head?',
          next: '133',
          answer: {
            name: '132.MULTIPLE_CHOICE_QUESTION',
            type: 'Integer',
            choices: [
              {
                value: 3,
                text: 'All the time',
              },
              {
                value: 2,
                text: 'Most of the time',
              },
              {
                value: 1,
                text: 'Sometimes',
              },
            ],
          },
        },
      },
      {
        EndNode: {
          nodeName: '127',
        },
      },
      {
        AssignmentNode: {
          nodeName: 'ASSIGN_129_BRANCH_1',
          next: '129',
          variable: {
            name: '131.MULTIPLE_CHOICE_SUMMATION#SEVERITY',
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
          nodeName: 'ASSIGN_130_BRANCH_2',
          next: '130',
          variable: {
            name: '131.MULTIPLE_CHOICE_SUMMATION#SEVERITY',
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
          nodeName: 'ASSIGN_128_BRANCH_3',
          next: '128',
          variable: {
            name: '131.MULTIPLE_CHOICE_SUMMATION#SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        MultipleChoiceSummationNode: {
          nodeName: '131',
          name: '131.MULTIPLE_CHOICE_SUMMATION',
          type: 'Integer',
          branchOnSum: true,
          questions: [
            '133.MULTIPLE_CHOICE_QUESTION',
            '132.MULTIPLE_CHOICE_QUESTION',
          ],
          intervals: [
            {
              from: 5,
              to: 6,
              next: 'ASSIGN_129_BRANCH_1',
            },
            {
              from: 3,
              to: 4,
              next: 'ASSIGN_130_BRANCH_2',
            },
            {
              from: 0,
              to: 2,
              next: 'ASSIGN_128_BRANCH_3',
            },
          ],
        },
      },
      {
        IONode: {
          nodeName: '129',
          elements: [
            {
              TextViewElement: {
                text: 'Not so good',
              },
            },
            {
              TextViewElement: {
                text: 'It is strongly recommended for you to see a doctor',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '127',
              },
            },
          ],
        },
      },
    ],
    output: [
      {
        name: '132.MULTIPLE_CHOICE_QUESTION',
        type: 'Integer',
      },
      {
        name: '131.MULTIPLE_CHOICE_SUMMATION',
        type: 'Integer',
      },
      {
        name: '131.MULTIPLE_CHOICE_SUMMATION#SEVERITY',
        type: 'String',
      },
      {
        name: '133.MULTIPLE_CHOICE_QUESTION',
        type: 'Integer',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/17`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/17/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
