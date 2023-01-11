import { Component, Input } from '@angular/core';
import { NodeComponent, ComponentParameters } from 'src/app/types/nodes.type';
import { QuestionnaireScope } from 'src/app/types/model.type';
import {
  Interval,
  MultipleChoiceSummationNode,
  NodeMap,
  OutputModel,
  SkipRepresentation,
  RepresentationType,
} from 'src/app/types/parser.type';

@Component({
  selector: 'app-multiple-choice-summation-node',
  templateUrl: './multiple-choice-summation-node.component.html',
  styleUrls: ['./multiple-choice-summation-node.component.less'],
})
export class MultipleChoiceSummationNodeComponent implements NodeComponent {
  @Input() node!: MultipleChoiceSummationNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;
  constructor() {}

  calculateSum = (
    outputNamesToInclude: string[],
    outputs: OutputModel
  ): number => {
    let sum = 0;
    outputNamesToInclude.forEach((outputName) => {
      sum += outputs[outputName].value as number;
    });

    return sum;
  };

  branchOnSum = (intervals: Interval[], sum: number): string => {
    for (const interval of intervals) {
      if (sum >= interval.from && sum <= interval.to) {
        return interval.next;
      }
    }

    throw new Error(
      'The sum does not fall within any of the specified branches. Error in questionnaire. Sum: ' +
        sum
    );
  };

  getNextNode = (node: MultipleChoiceSummationNode, sum: number): string => {
    if (node.branchOnSum === true) {
      return this.branchOnSum(node.intervals, sum);
    } else {
      return node.next!;
    }
  };

  getRepresentation = (): SkipRepresentation => {
    const sum: number = this.calculateSum(
      this.node.questions,
      this.scope.outputModel
    );

    const outputName: string = this.node.name;
    const outputType: string = this.node.type;

    this.scope.outputModel[outputName] = {
      name: outputName,
      type: outputType,
      value: sum,
    };

    const nextNode: string = this.getNextNode(this.node, sum);

    return {
      kind: RepresentationType.SKIP,
      nodeModel: { nodeId: this.node.nodeName },
      nextNodeId: nextNode,
    };
  };
}
