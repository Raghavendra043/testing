export const getMultipleChoiceWithBranch = (baseUrl: any) => {
  return {
    name: 'Multiple Choice (with branching)',
    version: '2.0',
    startNode: '125',
    endNode: '123',
    nodes: [
      {
        AssignmentNode: {
          nodeName: 'ASSIGN_124_BRANCH_6',
          next: '124',
          variable: {
            name: '125.MULTIPLE_CHOICE#SEVERITY',
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
          nodeName: 'ASSIGN_126_BRANCH_7',
          next: '126',
          variable: {
            name: '125.MULTIPLE_CHOICE#SEVERITY',
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
          nodeName: 'ASSIGN_126_BRANCH_8',
          next: '126',
          variable: {
            name: '125.MULTIPLE_CHOICE#SEVERITY',
            type: 'String',
          },
          expression: {
            type: 'String',
            value: 'GREEN',
          },
        },
      },
      {
        MultipleChoiceNode: {
          nodeName: '125',
          question: 'What is the answer to life the universe and everything?',
          branchOnChoices: true,
          answer: {
            name: '125.MULTIPLE_CHOICE',
            type: 'String',
            choices: [
              {
                value: '42',
                text: '42',
                next: 'ASSIGN_124_BRANCH_6',
              },
              {
                value: '13',
                text: '13',
                next: 'ASSIGN_126_BRANCH_7',
              },
              {
                value: '27',
                text: '27',
                next: 'ASSIGN_126_BRANCH_8',
              },
            ],
          },
        },
      },
      {
        IONode: {
          nodeName: '126',
          elements: [
            {
              TextViewElement: {
                text: 'Wrong',
              },
            },
            {
              TextViewElement: {
                text: 'Unfortunately not entirely correct',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '123',
              },
            },
          ],
        },
      },
      {
        EndNode: {
          nodeName: '123',
        },
      },
      {
        IONode: {
          nodeName: '124',
          elements: [
            {
              TextViewElement: {
                text: 'Correct',
              },
            },
            {
              TextViewElement: {
                text: 'That is absolutely correct!',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '123',
              },
            },
          ],
        },
      },
    ],
    output: [
      {
        name: '125.MULTIPLE_CHOICE#SEVERITY',
        type: 'String',
      },
      {
        name: '125.MULTIPLE_CHOICE',
        type: 'String',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/16`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/16/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
