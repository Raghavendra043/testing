import { Component, Input } from '@angular/core';
import { NodeComponent, ComponentParameters } from 'src/app/types/nodes.type';
import { Button, QuestionnaireScope } from 'src/app/types/model.type';
import {
  MeasurementNode,
  NodeMap,
  NodeModel,
  NodeRepresentation,
  RepresentationType,
  ManualFormInput,
  DynamicNodeModel,
} from '@app/types/parser.type';
import { FormArray, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ParserUtilsService } from '@services/parser-services/parser-utils.service';
import {
  PARSER_TYPES,
  ManualDeviceNodeParserType,
} from '@components/questionnaire-nodes/manual/manual-device-node/parser-types';

@Component({
  selector: 'manual-device-node',
  templateUrl: './manual-device-node.component.html',
  styleUrls: ['./manual-device-node.component.less'],
})
export class ManualDeviceNodeComponent implements NodeComponent {
  @Input() node!: MeasurementNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  //Form
  inputs: ManualFormInput[] = [];
  nodeForm = this.formBuilder.group({
    inputControls: this.formBuilder.array([]),
  });

  //Properties
  integerRegex = '[0-9]+';
  floatRegex = '([0-9]*[.,])?[0-9]+';

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private parserUtils: ParserUtilsService
  ) {}

  isOffendingValue(valueName: string) {
    return this.scope.hasOffendingValue(valueName);
  }

  getIndex(nodeTypeName: string): number {
    const index: number = this.inputs.findIndex((input: ManualFormInput) => {
      return input.nodeTypeName === nodeTypeName;
    });

    if (index < 0 || index === undefined) {
      return -1;
    } else {
      return index;
    }
  }

  getValue(nodeTypeName: string): number | undefined {
    const index = this.getIndex(nodeTypeName);
    let value = undefined;
    if (index >= 0) {
      value = this.inputControls.at(index).value;
    }
    return value;
  }

  getRepresentation = (): NodeRepresentation => {
    const nodeParserType: ManualDeviceNodeParserType = PARSER_TYPES.find(
      (obj: ManualDeviceNodeParserType) =>
        obj.typeName === this.parameters.parserTypeName
    )!;

    const nodeTypeName: string = nodeParserType.typeName;
    const nodeTypeValue: string = nodeParserType.typeValue;
    const translationId: string = nodeParserType.translationId;
    const formStep: string = nodeTypeValue === 'integer' ? '1' : 'any';
    const formPattern: string =
      nodeTypeValue === 'integer' ? this.integerRegex : this.floatRegex;

    const input: ManualFormInput = {
      nodeTypeName: nodeTypeName,
      nodeTypeValue: nodeTypeValue,
      translationId: translationId,
      formStep: formStep,
      formPattern: formPattern,
    };

    this.inputs.push(input);
    this.inputControls.push(
      this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(formPattern),
        ])
      )
    );

    const nodeModel: NodeModel = {
      nodeId: this.node.nodeName,
      heading: this.node.text,
      rangeCheck: (nodeModel: DynamicNodeModel): string[] => {
        nodeModel = {
          nodeModel,
          ...{ [nodeTypeName]: this.getValue(nodeTypeName) },
        };
        return this.parserUtils.checkInputRanges(
          [nodeTypeName],
          this.node,
          nodeModel
        );
      },
    };

    if ('comment' in this.node) {
      nodeModel.comment = this.node.comment;
    }

    const leftButton: Button = {
      show: true,
      text: 'SKIP',
      nextNodeId: this.node.nextFail,
    };

    const rightButton: Button = {
      show: true,
      text: 'NEXT',
      nextNodeId: this.node.next,
      validate: (scope: QuestionnaireScope) => {
        return !this.nodeForm.invalid;
      },
      click: (scope: QuestionnaireScope) => {
        const measurements = [nodeTypeName];

        const value = this.getValue(nodeTypeName);

        if (value !== undefined) {
          nodeModel[nodeTypeName] = value;

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
        } else {
          console.error(
            `Variabel in output model for nodeTypeName: '${nodeTypeName}' was undefined`
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
    this.parserUtils.addHelpMenu(this.node, representation);

    return representation;
  };

  onSubmit() {
    console.log(this.nodeForm.value);
  }

  get inputControls() {
    return this.nodeForm.get('inputControls') as FormArray;
  }
}
