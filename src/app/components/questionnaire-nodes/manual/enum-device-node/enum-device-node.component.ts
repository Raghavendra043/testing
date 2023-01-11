import { Component, Input } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { ParserUtilsService } from "src/app/services/parser-services/parser-utils.service";
import { NodeComponent, ComponentParameters } from "src/app/types/nodes.type";
import { Button, QuestionnaireScope } from "src/app/types/model.type";
import {
  EnumDeviceNodeParserType,
  EnumNodeModel,
  MeasurementNode,
  NodeMap,
  Representation,
  EnumFormInput,
  NodeRepresentation,
  RepresentationType,
} from "src/app/types/parser.type";

@Component({
  selector: "app-enum-device-node",
  templateUrl: "./enum-device-node.component.html",
  styleUrls: ["./enum-device-node.component.less"],
})
export class EnumDeviceNodeComponent implements NodeComponent {
  @Input() node!: MeasurementNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  //Form
  inputs: EnumFormInput[] = [];
  nodeForm = this.formBuilder.group({
    enum: ["", Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private parserUtils: ParserUtilsService
  ) {}

  getRepresentation = (): NodeRepresentation => {
    const nodeParserType: EnumDeviceNodeParserType =
      this.enumDeviceNodeParserTypes.find(
        (obj: EnumDeviceNodeParserType) =>
          obj.typeName === this.parameters.parserTypeName
      )!;

    const nodeTypeName: string = nodeParserType.typeName;
    const enumValues: string[] = nodeParserType.values;

    for (const enumValue of enumValues) {
      const input: EnumFormInput = {
        nodeTypeName: nodeTypeName,
        level: enumValue,
      };
      this.inputs.push(input);
    }

    const nodeModel: EnumNodeModel = {
      nodeId: this.node.nodeName,
      heading: this.node.text,
      enumValues: enumValues,
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
      validate: (scope: QuestionnaireScope) => !this.nodeForm.invalid,
      click: (scope: QuestionnaireScope) => {
        const radix = 10;
        const measurements = [nodeTypeName];
        const value: string = this.nodeForm.value.enum!;
        nodeModel[nodeTypeName] = parseInt(value, radix);

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

  enumDeviceNodeParserTypes: EnumDeviceNodeParserType[] = [
    {
      typeName: "bloodUrine",
      values: [
        "URINE_LEVEL_NEGATIVE",
        "URINE_LEVEL_PLUS_MINUS",
        "URINE_LEVEL_PLUS_ONE",
        "URINE_LEVEL_PLUS_TWO",
        "URINE_LEVEL_PLUS_THREE",
      ],
    },
    {
      typeName: "glucoseUrine",
      values: [
        "URINE_LEVEL_NEGATIVE",
        "URINE_LEVEL_PLUS_ONE",
        "URINE_LEVEL_PLUS_TWO",
        "URINE_LEVEL_PLUS_THREE",
        "URINE_LEVEL_PLUS_FOUR",
      ],
    },
    {
      typeName: "leukocytesUrine",
      values: [
        "URINE_LEVEL_NEGATIVE",
        "URINE_LEVEL_PLUS_ONE",
        "URINE_LEVEL_PLUS_TWO",
        "URINE_LEVEL_PLUS_THREE",
        "URINE_LEVEL_PLUS_FOUR",
      ],
    },
    {
      typeName: "nitriteUrine",
      values: ["URINE_LEVEL_NEGATIVE", "URINE_LEVEL_POSITIVE"],
    },
    {
      typeName: "urine",
      values: [
        "URINE_LEVEL_NEGATIVE",
        "URINE_LEVEL_PLUS_MINUS",
        "URINE_LEVEL_PLUS_ONE",
        "URINE_LEVEL_PLUS_TWO",
        "URINE_LEVEL_PLUS_THREE",
        "URINE_LEVEL_PLUS_FOUR",
      ],
    },
  ];

  onSubmit() {
    console.log(this.nodeForm.value);
  }

  get enum() {
    return this.nodeForm.get("enum") as FormControl;
  }
}
