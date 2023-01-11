import { Component, Input } from '@angular/core';
import { NodeComponent, ComponentParameters } from 'src/app/types/nodes.type';
import { QuestionnaireScope } from 'src/app/types/model.type';
import {
  SkipRepresentation,
  RepresentationType,
  DecisionNode,
  NodeMap,
  DecisionValueAndType,
  DecisionValueType,
  OutputModel,
} from 'src/app/types/parser.type';

enum Operator {
  LESS_THAN = 'lt',
  GREATER_THAN = 'gt',
  EQUAL = 'eq',
}

@Component({
  selector: 'app-decision-node',
  templateUrl: './decision-node.component.html',
  styleUrls: ['./decision-node.component.less'],
})
export class DecisionNodeComponent implements NodeComponent {
  @Input() node!: DecisionNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  constructor() {}

  getRepresentation(): SkipRepresentation {
    const operator: Operator = this.getOperator(this.node);
    const outputModel = this.scope.outputModel;

    const comparison = this.node.expression[operator];
    if (comparison === undefined) {
      throw new Error('Empty DecisionNode');
    }

    const left: DecisionValueAndType = this.getValueAndType(
      comparison.left,
      outputModel
    );
    const right: DecisionValueAndType = this.getValueAndType(
      comparison.right,
      outputModel
    );

    const evaluation: boolean = this.evaluate(operator, left, right);
    const nextNodeId: string = evaluation
      ? this.node.next
      : this.node.nextFalse;
    return {
      kind: RepresentationType.SKIP,
      nodeModel: { nodeId: this.node.nodeName },
      nextNodeId: nextNodeId,
    };
  }

  getOperator = (node: DecisionNode): Operator => {
    for (var candidate in node.expression) {
      switch (candidate) {
        case 'lt':
          return Operator.LESS_THAN;
        case 'gt':
          return Operator.GREATER_THAN;
        case 'eq':
          return Operator.EQUAL;
        default:
          throw new Error(`Unsupported operator: ${candidate}`);
      }
    }

    throw new Error('Empty DecisionNode');
  };

  getValueAndType = (
    side: DecisionValueAndType,
    outputModel: OutputModel
  ): DecisionValueAndType => {
    if (side.type === DecisionValueType.NAME) {
      const actualValue = outputModel[side.value as string].value;
      const actualType = outputModel[side.value as string]
        .type as DecisionValueType;

      return {
        value: actualValue,
        type: actualType,
      };
    } else {
      return {
        value: side.value,
        type: side.type,
      };
    }
  };

  evaluate = (
    operator: Operator,
    left: DecisionValueAndType,
    right: DecisionValueAndType
  ): boolean => {
    if (left.type !== right.type) {
      throw new TypeError(
        'Type for left and right side must be the same. Left: ' +
          left.type +
          ', right: ' +
          right.type
      );
    }

    switch (operator) {
      case Operator.LESS_THAN:
        if (left.type === DecisionValueType.BOOLEAN) {
          throw new TypeError(
            'Boolean expression with operators other than eq not supported.'
          );
        }
        return left.value < right.value;

      case Operator.GREATER_THAN:
        if (left.type === DecisionValueType.BOOLEAN) {
          throw new TypeError(
            'Boolean expression with operators other than eq not supported.'
          );
        }
        return left.value > right.value;

      case Operator.EQUAL:
        return left.value === right.value;
    }
  };
}
