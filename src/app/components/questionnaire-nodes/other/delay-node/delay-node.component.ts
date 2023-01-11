import { Component, Input } from '@angular/core';
import { NodeComponent, ComponentParameters } from 'src/app/types/nodes.type';
import {
  DelayNode,
  DelayNodeModel,
  NodeMap,
  NodeModel,
  NodeParserFunction,
  OutputModel,
  NodeRepresentation,
  Representation,
  RepresentationType,
} from 'src/app/types/parser.type';
import { Button, QuestionnaireScope } from 'src/app/types/model.type';

@Component({
  selector: 'app-delay-node',
  templateUrl: './delay-node.component.html',
  styleUrls: ['./delay-node.component.less'],
})
export class DelayNodeComponent implements NodeComponent {
  @Input() node!: DelayNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: Record<string, any>;

  nodeModel?: DelayNodeModel;

  onTimerStopped() {
    this.scope.nextNode(this.node.next, this.nodeMap);
  }

  getRepresentation() {
    const parseNode: NodeParserFunction<DelayNode> = (
      node,
      _nodeMap,
      _outputModel
    ) => {
      this.nodeModel = {
        nodeId: node.nodeName,
        heading: node.displayTextString,
        count: node.countUp ? 0 : node.countTime,
        countTime: node.countTime,
        countUp: node.countUp,
        onTimerStopped: this.onTimerStopped,
      };

      const centerButton: Button = {
        show: true,
        text: 'NEXT',
        validate: () => false,
      };

      const representation: NodeRepresentation = {
        kind: RepresentationType.NODE,
        nodeModel: this.nodeModel,
        centerButton: centerButton,
      };

      return representation;
    };

    return parseNode(this.node, this.nodeMap, this.scope.outputModel);
  }
}
