import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { MultipleChoiceSummationNodeComponent } from './multiple-choice-summation-node.component';

describe('MultipleChoiceSummationNodeComponent', () => {
  let component: MultipleChoiceSummationNodeComponent;
  let fixture: ComponentFixture<MultipleChoiceSummationNodeComponent>;

  async function init(
    node: any,
    nodeMap: any,
    fn?: any
  ): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [MultipleChoiceSummationNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MultipleChoiceSummationNodeComponent);

    component = fixture.componentInstance;
    //@ts-ignore
    component.node = node;
    component.nodeMap = nodeMap;
    //@ts-ignore
    component.scope = {
      outputModel: {},
    };
    //@ts-ignore
    component.parameters = undefined;
    if (fn) {
      fn();
    }
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    //@ts-ignore
    const representation: NodeRepresentation = component.getRepresentation();
    return representation;
  }

  describe('can parse MultipleChoiceSummationNode without branching on sum', () => {
    const node = {
      nodeName: '102',
      name: '102.MULTIPLE_CHOICE_SUMMATION',
      branchOnSum: false,
      next: '104',
      type: 'Integer',
      questions: [
        '100.MULTIPLE_CHOICE_QUESTION',
        '101.MULTIPLE_CHOICE_QUESTION',
      ],
    };

    const nextNode = {
      EndNode: {
        nodeName: '104',
      },
    };

    it('should sum the previous choice values', async () => {
      const setupOutputmodel = () => {
        component.scope.outputModel = {
          '100.MULTIPLE_CHOICE_QUESTION': {
            name: '100.MULTIPLE_CHOICE_QUESTION',
            value: 2,
            type: 'Integer',
          },
          '101.MULTIPLE_CHOICE_QUESTION': {
            name: '101.MULTIPLE_CHOICE_QUESTION',
            value: 3,
            type: 'Integer',
          },
        };
      };
      const representation: NodeRepresentation = await init(
        node,
        {
          '102': { MultipleChoiceSummationNode: node },
          '104': nextNode,
        },
        setupOutputmodel
      );
      const outputModel = component.scope.outputModel;

      expect(outputModel['102.MULTIPLE_CHOICE_SUMMATION']).toBeDefined();
      //@ts-ignore
      expect(outputModel['102.MULTIPLE_CHOICE_SUMMATION'].value).toBe(5);
    });
  });

  describe('can branch depending on the calculated sum', () => {
    const node = {
      nodeName: '102',
      name: '102.MULTIPLE_CHOICE_SUMMATION',
      branchOnSum: true,
      next: '104',
      type: 'Integer',
      questions: [
        '100.MULTIPLE_CHOICE_QUESTION',
        '101.MULTIPLE_CHOICE_QUESTION',
      ],
      intervals: [
        {
          from: 3,
          to: 4,
          next: 'ASSIGN_102_BRANCH_2',
        },
        {
          from: 0,
          to: 2,
          next: '104',
        },
      ],
    };

    const endNode = {
      // EndNode: {
      nodeName: '104',
      // },
    };

    const assignNode = {
      // AssignmentNode: {
      nodeName: 'ASSIGN_102_BRANCH_2',
      next: '104',
      variable: {
        name: '102.MULTIPLE_CHOICE_SUMMATION#SEVERITY',
        type: 'String',
      },
      expression: {
        type: 'String',
        value: 'GREEN',
      },
      // },
    };

    const nodeMap = {
      '102': node,
      '104': endNode,
      ASSIGN_102_BRANCH_2: assignNode,
    };

    const buildOutputModel = (sum: number) => {
      return {
        '100.MULTIPLE_CHOICE_QUESTION': {
          name: '100.MULTIPLE_CHOICE_QUESTION',
          value: 0,
          type: 'Integer',
        },
        '101.MULTIPLE_CHOICE_QUESTION': {
          name: '101.MULTIPLE_CHOICE_QUESTION',
          value: sum,
          type: 'Integer',
        },
      };
    };

    xit('should assign severity when sum falls in that range', async () => {
      // TODO: Unable to tests this because this requires rendering multiple nodes
      const setupOutputmodel = () => {
        component.scope.outputModel = buildOutputModel(4);
      };

      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        setupOutputmodel
      );

      const outputModel = component.scope.outputModel;

      expect(outputModel['102.MULTIPLE_CHOICE_SUMMATION'].value).toBe(4);
      expect(outputModel['102.MULTIPLE_CHOICE_SUMMATION#SEVERITY'].value).toBe(
        'GREEN'
      );
    });

    xit('should go directly to end node when sum falls in that range', async () => {
      // TODO: Unable to tests this because this requires rendering multiple nodes

      const setupOutputmodel = () => {
        component.scope.outputModel = buildOutputModel(0);
      };

      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        setupOutputmodel
      );
      const outputModel = component.scope.outputModel;
      expect(outputModel['102.MULTIPLE_CHOICE_SUMMATION'].value).toBe(0);
      expect(
        outputModel['102.MULTIPLE_CHOICE_SUMMATION#SEVERITY']
      ).toBeUndefined();
    });
  });
});
