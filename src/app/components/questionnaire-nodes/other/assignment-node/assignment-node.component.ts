import { Component, Input } from '@angular/core';
import { NodeComponent, ComponentParameters } from 'src/app/types/nodes.type';
import { QuestionnaireScope } from 'src/app/types/model.type';
import {
  SkipRepresentation,
  RepresentationType,
  AssignmentNode,
  NodeMap,
  NodeValueEntry,
} from 'src/app/types/parser.type';

@Component({
  selector: 'app-assignment-node',
  templateUrl: './assignment-node.component.html',
  styleUrls: ['./assignment-node.component.less'],
})
export class AssignmentNodeComponent implements NodeComponent {
  @Input() node!: AssignmentNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  constructor() {}

  getRepresentation(): SkipRepresentation {
    const assignmentVariable: NodeValueEntry = this.node.variable;

    this.scope.outputModel[assignmentVariable.name] = {
      name: assignmentVariable.name,
      type: assignmentVariable.type,
      value: this.node.expression.value,
    };

    const nextNodeId: string = this.node.next;
    return {
      kind: RepresentationType.SKIP,
      nodeModel: { nodeId: this.node.nodeName },
      nextNodeId: nextNodeId,
    };
  }
}
