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
  BloodSugarNodeModel,
  DynamicNodeModel,
  MeasurementNode,
  NodeMap,
  Representation,
  RepresentationType,
} from 'src/app/types/parser.type';
import {
  getAllFormFields,
  getAllFormValues,
} from '@components/questionnaire-nodes/node-form-utils';

@Component({
  selector: 'app-blood-sugar-mgdl-manual-device-node',
  templateUrl: './blood-sugar-mgdl-manual-device-node.component.html',
  styleUrls: ['./blood-sugar-mgdl-manual-device-node.component.less'],
})
export class BloodSugarMGDLManualDeviceNodeComponent implements NodeComponent {
  @Input() node!: MeasurementNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  nodeForm = this.formBuilder.group({
    bloodSugarMeasurements: [
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern('([0-9]*[.,])?[0-9]+'),
      ]),
    ],
    mealIndicator: ['none', Validators.required],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private parserUtils: ParserUtilsService
  ) {}

  isOffendingValue(valueName: string) {
    return this.scope.hasOffendingValue(valueName);
  }

  getRepresentation = (): Representation => {
    const nodeModel: BloodSugarNodeModel = {
      nodeId: this.node.nodeName,
      heading: this.node.text,
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
      validate: (scope: QuestionnaireScope) => !this.nodeForm.invalid,
      click: (scope: QuestionnaireScope) => {
        const bloodSugarMeasurements = this.node.bloodSugarMeasurements!;
        const nodeName: string = bloodSugarMeasurements.name;
        const nodeType: string = bloodSugarMeasurements.type;

        const formValues: any = this.nodeForm.value;
        const mealIndicator: string = formValues.mealIndicator;
        nodeModel.mealIndicator = mealIndicator;

        const timestamp = new Date().toISOString();
        scope.outputModel[nodeName] = {
          name: nodeName,
          type: nodeType,
          value: {
            measurements: [
              {
                result: formValues.bloodSugarMeasurements,
                isBeforeMeal:
                  mealIndicator === 'bloodSugarManualBeforeMeal'
                    ? true
                    : undefined,
                isAfterMeal:
                  mealIndicator === 'bloodSugarManualAfterMeal'
                    ? true
                    : undefined,
                isFasting:
                  mealIndicator === 'bloodSugarManualFasting'
                    ? true
                    : undefined,
                timeOfMeasurement: timestamp,
              },
            ],
            transferTime: timestamp,
          },
        };

        this.parserUtils.addMeasurementCommentToOutput(
          scope.outputModel,
          nodeModel,
          this.node
        );

        this.parserUtils.addManualMeasurementOriginToOutput(
          scope.outputModel,
          this.node
        );
      },
    };

    const representation: Representation = {
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

  get bloodSugarMeasurements(): FormControl {
    return this.nodeForm.get('bloodSugarMeasurements') as FormControl;
  }

  get mealIndicator(): FormControl {
    return this.nodeForm.get('mealIndicator') as FormControl;
  }
}
