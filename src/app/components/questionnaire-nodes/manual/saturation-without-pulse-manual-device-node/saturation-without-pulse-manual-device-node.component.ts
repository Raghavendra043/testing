import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { ParserUtilsService } from "src/app/services/parser-services/parser-utils.service";
import { NodeComponent, ComponentParameters } from "src/app/types/nodes.type";
import { Button, QuestionnaireScope } from "src/app/types/model.type";
import {
  getAllFormFields,
  getAllFormValues,
  positiveIntegerRegex,
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
  selector: "app-saturation-without-pulse-manual-device-node",
  templateUrl: "./saturation-without-pulse-manual-device-node.component.html",
  styleUrls: ["./saturation-without-pulse-manual-device-node.component.less"],
})
export class SaturationWithoutPulseManualDeviceNodeComponent
  implements NodeComponent
{
  @Input() node!: MeasurementNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  nodeForm = this.formBuilder.group({
    saturation: [
      "",
      Validators.compose([
        Validators.required,
        Validators.pattern(positiveIntegerRegex),
      ]),
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
    const validate = (scope: QuestionnaireScope) => {
      return !this.nodeForm.invalid;
    };

    const generateRepresentation = (
      node: MeasurementNode,
      nodeModel: NodeModel
    ): NodeRepresentation => {
      const clickAction = (scope: QuestionnaireScope) => {
        const measurements = ["saturation"];

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

      const representation: Representation = {
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

  get saturation(): FormControl {
    return this.nodeForm.get("saturation") as FormControl;
  }
}
