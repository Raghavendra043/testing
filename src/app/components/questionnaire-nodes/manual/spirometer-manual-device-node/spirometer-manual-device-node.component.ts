import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ParserUtilsService } from "src/app/services/parser-services/parser-utils.service";
import { NodeComponent, ComponentParameters } from "src/app/types/nodes.type";
import { Button, QuestionnaireScope } from "src/app/types/model.type";
import {
  floatRegex,
  getAllFormFields,
  getAllFormValues,
} from "src/app/components/questionnaire-nodes/node-form-utils";
import {
  MeasurementNode,
  NodeMap,
  NodeModel,
  OutputModel,
  Representation,
  NodeRepresentation,
  RepresentationType,
  DynamicNodeModel,
} from "src/app/types/parser.type";

@Component({
  selector: "app-spirometer-manual-device-node",
  templateUrl: "./spirometer-manual-device-node.component.html",
  styleUrls: ["./spirometer-manual-device-node.component.less"],
})
export class SpirometerManualDeviceNodeComponent implements NodeComponent {
  @Input() node!: MeasurementNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  validators = Validators.compose([
    Validators.required,
    Validators.pattern(floatRegex),
  ]);

  optionalValidators = Validators.pattern(floatRegex);

  nodeForm = this.formBuilder.group({
    fev1: ["", this.validators],
    fev6: ["", this.optionalValidators],
    fev1Fev6Ratio: ["", this.optionalValidators],
    fef2575: ["", this.optionalValidators],
  });

  constructor(
    private formBuilder: FormBuilder,
    private parserUtils: ParserUtilsService
  ) {}

  isOffendingValue(valueName: string) {
    return this.scope.hasOffendingValue(valueName);
  }

  getRepresentation(): Representation {
    const validate = (scope: QuestionnaireScope) => {
      return !this.nodeForm.invalid;
    };

    const generateRepresentation = (
      node: MeasurementNode,
      nodeModel: NodeModel
    ): NodeRepresentation => {
      const clickAction = (scope: QuestionnaireScope) => {
        const measurements = ["fev1", "fev6", "fev1Fev6Ratio", "fef2575"];

        this.parserUtils.addMeasurementsToOutput(
          scope.outputModel,
          this.nodeForm.value,
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

      const leftButton: Button = {
        show: true,
        text: "SKIP",
        nextNodeId: node.nextFail,
      };

      const rightButton: Button = {
        show: true,
        text: "NEXT",
        nextNodeId: node.next,
        validate: validate,
        click: clickAction,
      };

      const representation: NodeRepresentation = {
        kind: RepresentationType.NODE,
        nodeModel: nodeModel,
        leftButton: leftButton,
        rightButton: rightButton,
      };

      return representation;
    };

    const parseNode = (
      node: MeasurementNode,
      _nodeMap: NodeMap,
      _outputModel: OutputModel
    ) => {
      const nodeModel: NodeModel = {
        nodeId: node.nodeName,
        heading: node.text,
        info: "CONNECTING",
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

      if ("comment" in node) {
        nodeModel.comment = node.comment;
      }

      const representation: Representation = generateRepresentation(
        node,
        nodeModel
      );
      this.parserUtils.addHelpMenu(node, representation);

      return representation;
    };

    return parseNode(this.node, this.nodeMap, this.scope.outputModel);
  }

  onSubmit() {
    console.log(this.nodeForm.value);
  }

  get fev1(): FormControl {
    return this.nodeForm.get("fev1") as FormControl;
  }
  get fev6(): FormControl {
    return this.nodeForm.get("fev6") as FormControl;
  }
  get fev1Fev6Ratio(): FormControl {
    return this.nodeForm.get("fev1Fev6Ratio") as FormControl;
  }
  get fef2575(): FormControl {
    return this.nodeForm.get("fef2575") as FormControl;
  }
}
