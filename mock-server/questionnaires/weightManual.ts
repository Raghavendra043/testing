export const getWeightManual = (baseUrl: any) => {
  return {
    name: 'Weight (manual with branching)',
    version: '1.0',
    startNode: '138',
    endNode: '136',
    nodes: [
      {
        DecisionNode: {
          nodeName: 'THRESHOLD_DECISION_RED_HIGH_143',
          next: '140',
          nextFalse: 'THRESHOLD_DECISION_YELLOW_HIGH_143',
          expression: {
            gt: {
              left: {
                type: 'name',
                value: '143.WEIGHT',
              },
              right: {
                type: 'Float',
                value: 90.0,
              },
            },
          },
        },
      },
      {
        DecisionNode: {
          nodeName: 'THRESHOLD_DECISION_YELLOW_HIGH_143',
          next: '139',
          nextFalse: 'THRESHOLD_DECISION_RED_LOW_143',
          expression: {
            gt: {
              left: {
                type: 'name',
                value: '143.WEIGHT',
              },
              right: {
                type: 'Float',
                value: 80.0,
              },
            },
          },
        },
      },
      {
        DecisionNode: {
          nodeName: 'THRESHOLD_DECISION_RED_LOW_143',
          next: '137',
          nextFalse: 'THRESHOLD_DECISION_YELLOW_LOW_143',
          expression: {
            lt: {
              left: {
                type: 'name',
                value: '143.WEIGHT',
              },
              right: {
                type: 'Float',
                value: 45.0,
              },
            },
          },
        },
      },
      {
        DecisionNode: {
          nodeName: 'THRESHOLD_DECISION_YELLOW_LOW_143',
          next: '141',
          nextFalse: '142',
          expression: {
            lt: {
              left: {
                type: 'name',
                value: '143.WEIGHT',
              },
              right: {
                type: 'Float',
                value: 50.0,
              },
            },
          },
        },
      },
      {
        WeightManualDeviceNode: {
          nodeName: '143',
          next: 'THRESHOLD_DECISION_RED_HIGH_143',
          nextFail: 'AN_143_CANCEL',
          text: 'Measure your weight and enter the value',
          comment: {
            name: '143.WEIGHT#COMMENT',
            type: 'String',
          },
          origin: {
            name: '143.WEIGHT#ORIGIN',
            type: 'Object',
          },
          weight: {
            name: '143.WEIGHT',
            type: 'Float',
            range: {
              min: 30,
              max: 250,
            },
          },
        },
      },
      {
        AssignmentNode: {
          nodeName: 'AN_143_CANCEL',
          next: 'ANSEV_136_F143',
          variable: {
            name: '143.WEIGHT##CANCEL',
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
          nodeName: 'ANSEV_136_F143',
          next: '136',
          variable: {
            name: '143.WEIGHT##SEVERITY',
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
          nodeName: 'ANSEV_142_D143',
          next: '142',
          variable: {
            name: '143.WEIGHT##SEVERITY',
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
          nodeName: '140',
          elements: [
            {
              TextViewElement: {
                text: 'Overweight',
              },
            },
            {
              TextViewElement: {
                text: 'You are heavily overweight',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '136',
              },
            },
          ],
        },
      },
      {
        IONode: {
          nodeName: '142',
          elements: [
            {
              TextViewElement: {
                text: 'Normal',
              },
            },
            {
              TextViewElement: {
                text: 'Your weight is normal',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '136',
              },
            },
          ],
        },
      },
      {
        IONode: {
          nodeName: '141',
          elements: [
            {
              TextViewElement: {
                text: 'Underweight',
              },
            },
            {
              TextViewElement: {
                text: 'Your are underweight',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '136',
              },
            },
          ],
        },
      },
      {
        IONode: {
          nodeName: '138',
          elements: [
            {
              TextViewElement: {
                text: 'Weight',
              },
            },
            {
              TextViewElement: {
                text: 'Your weight will now be measured!',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '143',
              },
            },
          ],
        },
      },
      {
        EndNode: {
          nodeName: '136',
        },
      },
      {
        IONode: {
          nodeName: '137',
          elements: [
            {
              TextViewElement: {
                text: 'Underweight',
              },
            },
            {
              TextViewElement: {
                text: 'You are very underweight',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '136',
              },
            },
          ],
        },
      },
      {
        IONode: {
          nodeName: '139',
          elements: [
            {
              TextViewElement: {
                text: 'Overweight',
              },
            },
            {
              TextViewElement: {
                text: 'You are overweight',
              },
            },
            {
              ButtonElement: {
                text: 'NEXT',
                gravity: 'center',
                next: '136',
              },
            },
          ],
        },
      },
    ],
    output: [
      {
        name: '143.WEIGHT#ORIGIN',
        type: 'Object',
      },
      {
        name: '143.WEIGHT##SEVERITY',
        type: 'String',
      },
      {
        name: '143.WEIGHT#COMMENT',
        type: 'String',
      },
      {
        name: '143.WEIGHT',
        type: 'Float',
      },
      {
        name: '143.WEIGHT##CANCEL',
        type: 'Boolean',
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/questionnaires/6`,
      questionnaireResult: `${baseUrl}/clinician/api/patients/me/questionnaires/6/results`,
      patient: `${baseUrl}/clinician/api/patients/me`,
    },
  };
};
