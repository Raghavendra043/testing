import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { SkipRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { DecisionNodeComponent } from './decision-node.component';

describe('DecisionNodeComponent', () => {
  let component: DecisionNodeComponent;
  let fixture: ComponentFixture<DecisionNodeComponent>;

  const ifTrueNode = {
    AssignmentNode: {
      nodeName: 'AN_493_T492',
      next: '159',
      variable: {
        name: '492.DECISION',
        type: 'Boolean',
      },
      expression: {
        type: 'Boolean',
        value: true,
      },
    },
  };

  const ifFalseNode = {
    AssignmentNode: {
      nodeName: 'AN_496_F492',
      next: '159',
      variable: {
        name: '492.DECISION',
        type: 'Boolean',
      },
      expression: {
        type: 'Boolean',
        value: false,
      },
    },
  };

  const lastNode = {
    EndNode: {
      nodeName: '159',
    },
  };

  async function init(
    node: any,
    nodeMap: any,
    outputModel: any
  ): Promise<DecisionNodeComponent> {
    await TestBed.configureTestingModule({
      declarations: [DecisionNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DecisionNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = nodeMap;
    //@ts-ignore
    component.scope = { outputModel: outputModel };
    //@ts-ignore
    component.parameters = undefined;
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    return component;
  }

  async function buildDecisionNode(value: any, type: any) {
    return {
      nodeName: '492',
      next: 'AN_493_T492',
      nextFalse: 'AN_496_F492',
      expression: {
        lt: {
          left: {
            type: type,
            value: value,
          },
          right: {
            type: 'name',
            value: '491.BP#DIASTOLIC',
          },
        },
      },
    };
  }

  async function buildOutputModel(value: any, type: any) {
    return {
      '491.BP#DIASTOLIC': {
        name: '491.BP#DIASTOLIC',
        type: type,
        value: value,
      },
    };
  }

  async function runTestAndAssert(
    value: any,
    outputModelValue: any,
    type: any,
    expectedResult: any,
    buildDecisionNodeFn: any,
    getComponent?: boolean
  ) {
    const node = await buildDecisionNodeFn(value, type);
    const nodeMap = {
      '492': { DecisionNode: { node } },
      AN_493_T492: ifTrueNode,
      AN_496_F492: ifFalseNode,
      '159': lastNode,
    };

    const outputModel = await buildOutputModel(outputModelValue, type);
    //@ts-ignore
    const component: DecisionNodeComponent = await init(
      node,
      nodeMap,
      outputModel
    );
    if (getComponent) {
      return component;
    } else {
      const representation: SkipRepresentation = component.getRepresentation();
      expect(representation).toBeDefined();
      expect(representation.nextNodeId).toEqual(expectedResult);
      return component;
    }
  }

  describe('can parse DecisionNode less than expressions', () => {
    const trueValue = 'AN_493_T492';
    const falseValue = 'AN_496_F492';

    async function nodeFn(value: any, type: any) {
      return {
        nodeName: '492',
        next: 'AN_493_T492',
        nextFalse: 'AN_496_F492',
        expression: {
          lt: {
            left: {
              type: type,
              value: value,
            },
            right: {
              type: 'name',
              value: '491.BP#DIASTOLIC',
            },
          },
        },
      };
    }

    it('should evaluate less than Integer expression to true', async () => {
      await runTestAndAssert(41, 42, 'Integer', trueValue, nodeFn);
    });

    it('should evaluate less than Integer expression to false', async () => {
      await runTestAndAssert(43, 42, 'Integer', falseValue, nodeFn);
    });

    it('should evaluate less than Integer expression to false when values are equal', async () => {
      await runTestAndAssert(42, 42, 'Integer', falseValue, nodeFn);
    });

    it('should evaluate less than Float expression to true', async () => {
      await runTestAndAssert(41.9, 42.1, 'Float', trueValue, nodeFn);
    });

    it('should evaluate less than Float expression to false', async () => {
      await runTestAndAssert(42.2, 42.1, 'Float', falseValue, nodeFn);
    });

    it('should evaluate less than Float expression to false when values are equal', async () => {
      await runTestAndAssert(42.1, 42.1, 'Float', falseValue, nodeFn);
    });

    it('should throw error if datatype is Boolean and operator is lt', async () => {
      const getComponent = true;
      const component: DecisionNodeComponent = await runTestAndAssert(
        true,
        false,
        'Boolean',
        false,
        nodeFn,
        getComponent
      );

      expect(function () {
        component.getRepresentation();
      }).toThrowError();
    });
  });

  describe('can parse DecisionNode greater than expressions', () => {
    const trueValue = 'AN_493_T492';
    const falseValue = 'AN_496_F492';

    async function nodeFn(value: any, type: any) {
      return {
        nodeName: '492',
        next: 'AN_493_T492',
        nextFalse: 'AN_496_F492',
        expression: {
          gt: {
            left: {
              type: type,
              value: value,
            },
            right: {
              type: 'name',
              value: '491.BP#DIASTOLIC',
            },
          },
        },
      };
    }

    it('should evaluate greater than Integer expression to true', async () => {
      await runTestAndAssert(43, 42, 'Integer', trueValue, nodeFn);
    });

    it('should evaluate greater than Integer expression to false', async () => {
      await runTestAndAssert(41, 42, 'Integer', falseValue, nodeFn);
    });

    it('should evaluate greater than Integer expression to false when values are equal', async () => {
      await runTestAndAssert(42, 42, 'Integer', falseValue, nodeFn);
    });

    it('should evaluate greater than Float expression to true', async () => {
      await runTestAndAssert(42.11, 42.1, 'Float', trueValue, nodeFn);
    });

    it('should evaluate greater than Float expression to false', async () => {
      await runTestAndAssert(42.09, 42.1, 'Float', falseValue, nodeFn);
    });

    it('should evaluate greater than Float expression to false when values are equal', async () => {
      await runTestAndAssert(42.1, 42.1, 'Float', falseValue, nodeFn);
    });

    it('should throw error if datatype is Boolean and operator is gt', async () => {
      const getComponent = true;
      const component: DecisionNodeComponent = await runTestAndAssert(
        true,
        false,
        'Boolean',
        falseValue,
        nodeFn,
        getComponent
      );

      expect(function () {
        component.getRepresentation();
      }).toThrowError();
    });
  });

  describe('can parse DecisionNode equal expressions', () => {
    const trueValue = 'AN_493_T492';
    const falseValue = 'AN_496_F492';

    async function nodeFn(value: any, type: any) {
      return {
        nodeName: '492',
        next: 'AN_493_T492',
        nextFalse: 'AN_496_F492',
        expression: {
          eq: {
            left: {
              type: 'name',
              value: '491.BP#DIASTOLIC',
            },
            right: {
              type: type,
              value: value,
            },
          },
        },
      };
    }

    it('should evaluate equal Integer expression to true', async () => {
      await runTestAndAssert(42, 42, 'Integer', trueValue, nodeFn);
    });

    it('should evaluate equal Integer expression to false when left is less than', async () => {
      await runTestAndAssert(41, 42, 'Integer', falseValue, nodeFn);
    });

    it('should evaluate equal Integer expression to false when left is greater than', async () => {
      await runTestAndAssert(43, 42, 'Integer', falseValue, nodeFn);
    });

    it('should evaluate equal Float expression to true', async () => {
      await runTestAndAssert(42.11, 42.11, 'Float', trueValue, nodeFn);
    });

    it('should evaluate equal Float expression to false when left is less than', async () => {
      await runTestAndAssert(42.09, 42.1, 'Float', falseValue, nodeFn);
    });

    it('should evaluate equal Float expression to false when left is greater than', async () => {
      await runTestAndAssert(42.11, 42.1, 'Float', falseValue, nodeFn);
    });

    it('should evaluate equal Boolean expression to true when both are true', async () => {
      await runTestAndAssert(true, true, 'Boolean', trueValue, nodeFn);
    });

    it('should evaluate equal Boolean expression to true when both are false', async () => {
      await runTestAndAssert(false, false, 'Boolean', trueValue, nodeFn);
    });

    it('should evaluate equal Boolean expression to false when left is true', async () => {
      await runTestAndAssert(true, false, 'Boolean', falseValue, nodeFn);
    });

    it('should evaluate equal Boolean expression to false when left is false', async () => {
      await runTestAndAssert(false, true, 'Boolean', falseValue, nodeFn);
    });
  });
  describe('DecisionNode error handling', () => {
    async function getComponent(node: any, outputModel: any) {
      const nodeMap = {
        '492': { DecisionNode: { node } },
        AN_493_T492: ifTrueNode,
        AN_496_F492: ifFalseNode,
        '159': lastNode,
      };

      //@ts-ignore
      const component: DecisionNodeComponent = await init(
        node,
        nodeMap,
        outputModel
      );

      return component;
    }

    async function nodeFn(value: any, type: any) {
      return {
        nodeName: '492',
        next: 'AN_493_T492',
        nextFalse: 'AN_496_F492',
        expression: {
          eq: {
            left: {
              type: 'name',
              value: '491.BP#DIASTOLIC',
            },
            right: {
              type: type,
              value: value,
            },
          },
        },
      };
    }

    it('should throw error if operator is unsupported', async () => {
      const node = {
        nodeName: '492',
        next: 'AN_493_T492',
        nextFalse: 'AN_496_F492',
        expression: {
          lte: {
            left: {
              type: 'name',
              value: '491.BP#DIASTOLIC',
            },
            right: {
              type: 'Integer',
              value: 42,
            },
          },
        },
      };

      const outputModel = await buildOutputModel(42, 'Integer');
      const component: DecisionNodeComponent = await getComponent(
        node,
        outputModel
      );

      expect(function () {
        component.getRepresentation();
      }).toThrowError();
    });

    it('should throw error if datatypes does match', async () => {
      const node = await buildDecisionNode(true, 'Boolean');
      const outputModel = await buildOutputModel(42, 'Integer');
      const component: DecisionNodeComponent = await getComponent(
        node,
        outputModel
      );

      expect(function () {
        component.getRepresentation();
      }).toThrowError();
    });

    xit('should throw error if datatype is unsupported', async () => {
      // TODO: Seems like this functionality is deprecaed. Should it stay deprecated?
      const node = await buildDecisionNode(42, 'BloodSugarMeasurements');
      const outputModel = {
        '491.BP#DIASTOLIC': {
          name: '491.BP#DIASTOLIC',
          type: 'BloodSugarMeasurements',
          value: {
            measurements: [
              {
                result: 1,
                isBeforeMeal: true,
                isAfterMeal: false,
                timeOfMeasurement: '2014-10-14T08:29:56.045Z',
              },
            ],
            transferTime: '2014-10-14T08:29:56.045Z',
          },
        },
      };

      const component: DecisionNodeComponent = await getComponent(
        node,
        outputModel
      );

      expect(function () {
        component.getRepresentation();
      }).toThrowError();
    });
  });
});
