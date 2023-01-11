import { Component, Input } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { ParserUtilsService } from 'src/app/services/parser-services/parser-utils.service';
import { NodeComponent, ComponentParameters } from 'src/app/types/nodes.type';
import { Button, QuestionnaireScope } from 'src/app/types/model.type';
import {
  BloodPressureNodeModel,
  MeasurementNode,
  NodeMap,
  Representation,
  NodeRepresentation,
  RepresentationType,
  DynamicNodeModel,
} from 'src/app/types/parser.type';
import { Utils } from '@services/util-services/util.service';
import {
  getAllFormFields,
  getAllFormValues,
} from '@components/questionnaire-nodes/node-form-utils';

@Component({
  selector: 'blood-pressure-manual-device-node',
  templateUrl: './blood-pressure-manual-device-node.component.html',
  styleUrls: ['./blood-pressure-manual-device-node.component.less'],
})
export class BloodPressureManualDeviceNodeComponent implements NodeComponent {
  @Input() node!: MeasurementNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  nodeForm = this.formBuilder.group({
    systolic: [
      '',
      Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(999),
      ]),
    ],
    diastolic: [
      '',
      Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(999),
      ]),
    ],
    pulse: [
      '',
      Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(999),
      ]),
    ],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private parserUtils: ParserUtilsService,
    private utils: Utils
  ) {}

  isOffendingValue(valueName: string) {
    return this.scope.hasOffendingValue(valueName);
  }

  getRepresentation = (): Representation => {
    const nodeModel: BloodPressureNodeModel = {
      nodeId: this.node.nodeName,
      heading: this.node.text,
      ...(this.node.comment ? { comment: this.node.comment } : {}),
      info: 'CONNECTING',
      rangeCheck: (nodeModel: DynamicNodeModel): string[] => {
        nodeModel = {
          nodeModel,
          ...getAllFormValues(this.nodeForm),
        };
        return this.parserUtils.checkInputRanges(
          getAllFormFields(this.nodeForm),
          this.node,
          nodeModel
        );
      },
    };

    const validate = (scope: QuestionnaireScope): boolean => {
      return !this.nodeForm.invalid;
    };

    const clickAction = (scope: QuestionnaireScope) => {
      const measurements = ['systolic', 'diastolic', 'pulse'];

      const model = this.nodeForm.value;

      if ('systolic' in model && 'diastolic' in model && 'pulse' in model) {
        if (this.utils.exists(model.systolic))
          nodeModel.systolic = Number(model.systolic);
        if (this.utils.exists(model.diastolic))
          nodeModel.diastolic = Number(model.diastolic);
        if (this.utils.exists(model.pulse))
          nodeModel.pulse = Number(model.pulse);

        this.parserUtils.addMeasurementsToOutput(
          scope.outputModel,
          nodeModel,
          this.node,
          measurements
        );

        this.parserUtils.addMeasurementCommentToOutput(
          scope.outputModel,
          nodeModel,
          this.node
        );
        this.parserUtils.addManualMeasurementOriginToOutput(
          scope.outputModel,
          this.node
        );
      }
    };

    const leftButton: Button = {
      show: true,
      text: 'SKIP',
      nextNodeId: this.node.nextFail,
    };

    const rightButton: Button = {
      show: true,
      text: 'NEXT',
      nextNodeId: this.node.next,
      validate: validate,
      click: clickAction,
    };

    const representation: NodeRepresentation = {
      kind: RepresentationType.NODE,
      nodeModel: nodeModel,
      leftButton: leftButton,
      rightButton: rightButton,
    };
    this.parserUtils.addHelpMenu(this.node, representation);

    return representation;
  };

  onSubmit() {
    console.log(this.nodeForm.value);
  }

  get systolic(): FormControl {
    return this.nodeForm.get('systolic') as FormControl;
  }

  get diastolic(): FormControl {
    return this.nodeForm.get('diastolic') as FormControl;
  }

  get pulse(): FormControl {
    return this.nodeForm.get('pulse') as FormControl;
  }
}
