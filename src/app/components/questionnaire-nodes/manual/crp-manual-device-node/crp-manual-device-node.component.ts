import { Component, Input } from "@angular/core";
import {
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from "@angular/forms";
import { ParserUtilsService } from "src/app/services/parser-services/parser-utils.service";
import { NodeComponent, ComponentParameters } from "src/app/types/nodes.type";
import { Button, QuestionnaireScope } from "src/app/types/model.type";
import { floatRegex } from "src/app/components/questionnaire-nodes/node-form-utils";
import {
  CRPNodeModel,
  MeasurementNode,
  NodeMap,
  Representation,
  NodeRepresentation,
  RepresentationType,
  DynamicNodeModel,
} from "src/app/types/parser.type";

@Component({
  selector: "app-crp-manual-device-node",
  templateUrl: "./crp-manual-device-node.component.html",
  styleUrls: ["./crp-manual-device-node.component.less"],
})
export class CrpManualDeviceNodeComponent implements NodeComponent {
  @Input() node!: MeasurementNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  nodeForm = this.formBuilder.group({
    crpLt5Measurement: [false],
    crpCountMeasurement: [
      "",
      [Validators.required, Validators.pattern(floatRegex)],
    ],
  });

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private parserUtils: ParserUtilsService
  ) {}

  isOffendingValue(valueName: string) {
    return this.scope.hasOffendingValue(valueName);
  }

  getValue(): number {
    const crpValue = this.node.CRP;
    if (crpValue === undefined) {
      throw new Error("CRP Value not properly defined");
    }
    const formValues = this.nodeForm.getRawValue();
    const lt5 = formValues.crpLt5Measurement;
    const count = Number(formValues.crpCountMeasurement);
    const lessThanFive = lt5 || count < 5;
    return lessThanFive ? 0 : count;
  }

  getRepresentation = (): Representation => {
    const nodeModel: CRPNodeModel = {
      nodeId: this.node.nodeName,
      heading: this.node.text,
      rangeCheck: (nodeModel: DynamicNodeModel): string[] => {
        nodeModel = {
          nodeModel,
          ...{ CRP: this.getValue() },
        };
        return this.parserUtils.checkInputRanges(["CRP"], this.node, nodeModel);
      },
    };
    if ("comment" in this.node) {
      nodeModel.comment = this.node.comment;
    }

    const leftButton: Button = {
      show: true,
      text: "SKIP",
      nextNodeId: this.node.nextFail,
    };

    const rightButton: Button = {
      show: true,
      text: "NEXT",
      nextNodeId: this.node.next,
      validate: () => {
        const isLt5CheckedAndNothingElse = (): boolean => {
          const formValues = this.nodeForm.getRawValue();

          return (
            formValues.crpLt5Measurement === true &&
            (formValues.crpCountMeasurement === undefined ||
              formValues.crpCountMeasurement === null ||
              formValues.crpCountMeasurement.toString().length === 0)
          );
        };

        const isValueEnteredAndNothingElse = () => {
          const formValues = this.nodeForm.value;

          return (
            formValues.crpLt5Measurement !== true &&
            formValues.crpCountMeasurement !== undefined &&
            formValues.crpCountMeasurement !== null &&
            0 <= Number(formValues.crpCountMeasurement) &&
            0 < formValues.crpCountMeasurement.toString().length
          );
        };
        return isLt5CheckedAndNothingElse() || isValueEnteredAndNothingElse();
      },
      click: (scope: QuestionnaireScope) => {
        const crpValue = this.node.CRP;

        if (crpValue === undefined) {
          throw new Error("CRP Value not properly defined");
        }

        const formValues = this.nodeForm.getRawValue();
        const nodeName = crpValue.name;
        const lt5 = formValues.crpLt5Measurement;
        const count = Number(formValues.crpCountMeasurement);
        scope.outputModel[nodeName] = {
          name: nodeName,
          type: crpValue.type,
          value: this.getValue(),
        };

        const crpNodeModel: CRPNodeModel = {
          nodeId: nodeModel.nodeId,
          crpLt5Measurement: lt5,
          crpCountMeasurement: count,
        };

        this.parserUtils.addMeasurementCommentToOutput(
          scope.outputModel,
          crpNodeModel,
          this.node
        );
        this.parserUtils.addManualMeasurementOriginToOutput(
          scope.outputModel,
          this.node
        );
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

  get crpLt5Measurement(): FormControl {
    return this.nodeForm.get("crpLt5Measurement") as FormControl;
  }

  get crpCountMeasurement(): FormControl {
    return this.nodeForm.get("crpCountMeasurement") as FormControl;
  }
}
