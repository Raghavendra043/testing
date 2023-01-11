import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ParserUtilsService } from 'src/app/services/parser-services/parser-utils.service';
import { NodeComponent, ComponentParameters } from 'src/app/types/nodes.type';
import { Button, QuestionnaireScope } from 'src/app/types/model.type';
import {
  PainScaleNode,
  PainScaleNodeModel,
  NodeRepresentation,
  NodeMap,
  OutputModel,
  Representation,
  RepresentationType,
} from 'src/app/types/parser.type';

@Component({
  selector: 'app-pain-scale-manual-device-node',
  templateUrl: './pain-scale-manual-device-node.component.html',
  styleUrls: ['./pain-scale-manual-device-node.component.less'],
})
export class PainScaleManualDeviceNodeComponent implements NodeComponent {
  @Input() node!: PainScaleNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  defaultValue = 5;

  nodeForm = this.formBuilder.group({
    painScaleMeasurement: [this.defaultValue, Validators.required],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private parserUtils: ParserUtilsService
  ) {}

  getRepresentation(): Representation {
    const parseNode = (
      node: PainScaleNode,
      _nodeMap: NodeMap,
      _outputModel: OutputModel
    ): NodeRepresentation => {
      const nodeModel: PainScaleNodeModel = {
        nodeId: node.nodeName,
        heading: node.text,
        painScaleMeasurement: this.defaultValue,
      };

      if ('comment' in node) {
        nodeModel.comment = node.comment;
      }

      const leftButton: Button = {
        show: true,
        text: 'SKIP',
        nextNodeId: node.nextFail,
      };

      const rightButton: Button = {
        show: true,
        text: 'NEXT',
        nextNodeId: node.next,
        click: (scope: QuestionnaireScope) => {
          const nodeName = node.painScale.name;
          if ('painScaleMeasurement' in this.nodeForm.value) {
            const formValue = this.nodeForm.getRawValue();

            scope.outputModel[nodeName] = {
              name: nodeName,
              type: node.painScale.type,
              value: formValue.painScaleMeasurement,
            };

            this.parserUtils.addMeasurementCommentToOutput(
              scope.outputModel,
              nodeModel,
              node
            );
          }
        },
      };

      const representation: NodeRepresentation = {
        kind: RepresentationType.NODE,
        nodeModel: nodeModel,
        leftButton: leftButton,
        rightButton: rightButton,
      };
      this.parserUtils.addHelpMenu(node, representation);

      return representation;
    };

    return parseNode(this.node, this.nodeMap, this.scope.outputModel);
  }

  onSubmit() {
    console.log(this.nodeForm.value);
  }

  get painScaleMeasurement(): FormControl {
    return this.nodeForm.get('painScaleMeasurement') as FormControl;
  }
}
