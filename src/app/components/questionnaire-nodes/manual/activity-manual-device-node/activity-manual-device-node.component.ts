import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ParserUtilsService } from 'src/app/services/parser-services/parser-utils.service';
import { NodeComponent, ComponentParameters } from 'src/app/types/nodes.type';
import { Button, QuestionnaireScope } from 'src/app/types/model.type';
import {
  ActivityNodeModel,
  DynamicNodeModel,
  MeasurementNode,
  NodeMap,
  NodeRepresentation,
  Representation,
  RepresentationType,
} from 'src/app/types/parser.type';
import {
  getAllFormFields,
  getAllFormValues,
} from '@components/questionnaire-nodes/node-form-utils';

@Component({
  selector: 'app-activity-manual-device-node',
  templateUrl: './activity-manual-device-node.component.html',
  styleUrls: ['./activity-manual-device-node.component.less'],
})
export class ActivityManualDeviceNodeComponent implements NodeComponent {
  @Input() node!: MeasurementNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  nodeForm: FormGroup = this.formBuilder.group({
    dailySteps: [
      '',
      Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
    ],
  });

  constructor(
    private formBuilder: FormBuilder,
    private parserUtils: ParserUtilsService
  ) {}

  isOffendingValue(valueName: string) {
    return this.scope.hasOffendingValue(valueName);
  }

  getRepresentation(): Representation {
    const comment = this.node.comment;
    const nodeModel: ActivityNodeModel = {
      nodeId: this.node.nodeName,
      heading: this.node.text,
      ...(comment ? { comment } : {}),
      rangeCheck: (nodeModel: DynamicNodeModel): string[] => {
        nodeModel = {
          nodeModel,
          ...getAllFormValues(this.nodeForm),
        };
        const fields = getAllFormFields(this.nodeForm);
        return this.parserUtils.checkInputRanges(
          getAllFormFields(this.nodeForm),
          this.node,
          nodeModel
        );
      },
    };

    const representation: NodeRepresentation = this.generateRepresentation(
      this.node,
      nodeModel
    );
    this.parserUtils.addHelpMenu(this.node, representation);

    return representation;
  }

  private generateRepresentation(
    node: MeasurementNode,
    nodeModel: ActivityNodeModel
  ): NodeRepresentation {
    const leftButton: Button = {
      show: true,
      text: 'SKIP',
      nextNodeId: node.nextFail,
    };

    const rightButton: Button = {
      show: true,
      text: 'NEXT',
      nextNodeId: node.next,
      validate: this.validate,
      click: (scope: QuestionnaireScope) =>
        this.addMeasurement(nodeModel, node, scope),
    };

    return {
      kind: RepresentationType.NODE,
      nodeModel: nodeModel,
      leftButton: leftButton,
      rightButton: rightButton,
    };
  }

  private addMeasurement = (
    nodeModel: ActivityNodeModel,
    node: MeasurementNode,
    scope: QuestionnaireScope
  ): void => {
    const measurements = ['dailySteps'];
    nodeModel.dailySteps = Number(this.nodeForm.value.dailySteps);

    this.parserUtils.addMeasurementsToOutput(
      scope.outputModel,
      nodeModel,
      node,
      measurements
    );

    this.parserUtils.addMeasurementCommentToOutput(
      scope.outputModel,
      nodeModel,
      node
    );
    this.parserUtils.addManualMeasurementOriginToOutput(
      scope.outputModel,
      node
    );
  };

  private validate = (scope: QuestionnaireScope) => {
    return !this.nodeForm.invalid;
  };

  onSubmit() {
    console.log(this.nodeForm.value);
  }

  get dailySteps(): FormControl {
    const f = this.nodeForm.get('dailySteps');
    return f as FormControl;
  }
}
