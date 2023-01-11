import { Component, Input, OnInit } from '@angular/core';
import { NodeComponent, ComponentParameters } from 'src/app/types/nodes.type';
import { QuestionnaireScope } from 'src/app/types/model.type';
import {
  QuestionnaireNode,
  EndRepresentation,
  NodeMap,
  RepresentationType,
} from 'src/app/types/parser.type';

@Component({
  selector: 'app-end-node',
  templateUrl: './end-node.component.html',
  styleUrls: ['./end-node.component.less'],
})
export class EndNodeComponent implements NodeComponent, OnInit {
  @Input() node!: QuestionnaireNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  constructor() {}

  ngOnInit(): void {}

  getRepresentation(): EndRepresentation {
    return {
      kind: RepresentationType.END,
      nodeModel: { nodeId: this.node.nodeName },
    };
  }
}
