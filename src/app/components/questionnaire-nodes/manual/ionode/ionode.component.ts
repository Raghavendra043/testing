import { Component, Input } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ParserUtilsService } from "src/app/services/parser-services/parser-utils.service";
import { NodeComponent, ComponentParameters } from "src/app/types/nodes.type";
import { Button, QuestionnaireScope } from "src/app/types/model.type";
import {
  ButtonElement,
  EditTextElement,
  HelpNode,
  HelpTextElement,
  IONode,
  NodeElement,
  NodeElementWrapper,
  NodeMap,
  OriginElement,
  OutputModel,
  Representation,
  NodeRepresentation,
  TextViewElement,
  TwoButtonElement,
  RepresentationType,
} from "src/app/types/parser.type";

type EditTextFormControl = {
  name: string;
  type: string;
  pattern: RegExp;
  step: string;
  label: string;
};

@Component({
  selector: "app-ionode",
  templateUrl: "./ionode.component.html",
  styleUrls: ["./ionode.component.less"],
})
export class IONodeComponent implements NodeComponent {
  @Input() node!: IONode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  // Form
  textInputs: EditTextFormControl[] = [];
  inputs: EditTextFormControl[] = [];
  nodeForm = this.formBuilder.group({
    textInputControls: this.formBuilder.array<string>([]),
    inputControls: this.formBuilder.array<string>([]),
  });

  // Properties
  labels: string[] = [];
  clickActions: ((scope: QuestionnaireScope) => unknown)[] = [];
  validateActions: ((scope: QuestionnaireScope) => unknown)[] = [];

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private parserUtils: ParserUtilsService
  ) {}

  getRepresentation(): Representation {
    const representation: NodeRepresentation = {
      kind: RepresentationType.NODE,
      nodeModel: {
        nodeId: this.node.nodeName,
      },
    };

    this.node.elements.forEach((elementWrapper: NodeElementWrapper) => {
      const elementName: string =
        this.parserUtils.getElementType(elementWrapper)!;
      this.callHandler(
        elementName,
        elementWrapper[elementName],
        representation
      );
    });

    return representation;
  }

  private callHandler = (
    elementName: string,
    element: NodeElement,
    representation: NodeRepresentation
  ) => {
    switch (elementName) {
      case "TextViewElement":
        this.handleTextViewElement(element as TextViewElement);
        break;

      case "OriginElement":
        this.handleOriginElement(element as OriginElement);
        break;

      case "EditTextElement":
        this.handleEditTextElement(element as EditTextElement);
        break;

      case "ButtonElement":
        this.handleButtonElement(element as ButtonElement, representation);
        break;

      case "TwoButtonElement":
        this.handleTwoButtonElement(
          element as TwoButtonElement,
          representation
        );
        break;

      case "HelpTextElement":
        this.handleHelpTextElement(element as HelpTextElement, representation);
        break;

      default:
        console.error(
          `Unable to call handler for element type: ${elementName} for IONode`
        );
        break;
    }
  };

  private handleTextViewElement = (element: TextViewElement) => {
    return this.labels.push(element.text);
  };

  private handleOriginElement = (element: OriginElement) => {
    this.clickActions.push((scope: QuestionnaireScope) => {
      const originType: string = element.outputVariable.type;
      const originName: string = element.outputVariable.name;
      const originValue = {
        manualMeasurement: {
          enteredBy: "citizen",
        },
      };

      scope.outputModel[originName] = {
        name: originName,
        type: originType,
        value: originValue,
      };
    });
  };

  private handleEditTextElement = (element: EditTextElement) => {
    const rawElementType = element.outputVariable.type;
    if (!["String", "Integer", "Float"].includes(rawElementType)) {
      throw new Error(
        "Unexpected element type for EditTextElement: " + rawElementType
      );
    }

    const elementType: string = rawElementType === "String" ? "text" : "number";
    const fieldName: string = `input_${elementType}_${this.parserUtils.hashCode(
      element.outputVariable.name
    )}`;
    const formPattern = rawElementType === "String" ? /.*/ : /(\d*[.,])?\d+/;
    const formStep = rawElementType === "Integer" ? "1" : "any";
    let validators: ValidatorFn[];

    if (rawElementType === "String") {
      validators = [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(1800),
      ];
    } else if (rawElementType === "Integer") {
      validators = [Validators.required, this.isInteger];
    } else {
      validators = [Validators.required, Validators.pattern(formPattern)];
    }

    const editTextFormControl = {
      name: fieldName,
      type: elementType,
      pattern: formPattern,
      step: formStep,
      label: this.labels.pop() ?? "",
    };

    if (elementType === "text") {
      //'ioNodeTextInput.html'
      this.textInputs.push(editTextFormControl);
      this.textInputControls.push(this.formBuilder.control("", validators));
    } else {
      //'ioNodeInput.html'
      this.inputs.push(editTextFormControl);
      this.inputControls.push(this.formBuilder.control("", validators));
    }

    this.clickActions.push((scope: QuestionnaireScope) => {
      const variableName = element.outputVariable.name;
      let value = undefined;
      if (elementType === "text") {
        const index = this.textInputs.findIndex(({ name }) => {
          return name === fieldName;
        });
        if (index >= 0) {
          value = this.textInputControls.at(index).value;
        }
      } else {
        const index = this.inputs.findIndex((object: any) => {
          return object.name === fieldName;
        });
        if (index >= 0) {
          value = this.inputControls.at(index).value;
        }
      }
      if (value) {
        scope.outputModel[variableName] = {
          name: variableName,
          value: value,
          type: rawElementType,
        };
      } else {
        console.error(
          `Variabel in output model for name: '${variableName}', type: ${rawElementType} was undefined`
        );
      }
    });

    this.validateActions.push(
      (scope: QuestionnaireScope) => !this.nodeForm.invalid
    );
  };

  handleButtonElement = (
    element: ButtonElement,
    representation: NodeRepresentation
  ) => {
    const buttonRepresentation: Button = {
      show: true,
      text: element.text,
      nextNodeId: element.next,
    };
    this.setupClickActions(element.skipValidation, buttonRepresentation);

    switch (element.gravity) {
      case "center":
        representation.centerButton = buttonRepresentation;
        break;

      case "right":
        representation.rightButton = buttonRepresentation;
        break;

      case "left":
        representation.leftButton = buttonRepresentation;
        break;
    }
  };

  handleTwoButtonElement(
    element: TwoButtonElement,
    representation: NodeRepresentation
  ) {
    const leftButton: Button = {
      show: true,
      text: element.leftText,
      nextNodeId: element.leftNext,
    };
    this.setupClickActions(element.leftSkipValidation ?? false, leftButton);
    representation.leftButton = leftButton;

    const rightButton: Button = {
      show: true,
      text: element.rightText,
      nextNodeId: element.rightNext,
    };
    this.setupClickActions(element.rightSkipValidation ?? false, rightButton);
    representation.rightButton = rightButton;
  }

  setupClickActions(skipValidation: boolean, buttonRepresentation: Button) {
    if (skipValidation) {
      return;
    }

    buttonRepresentation.click = (scope: QuestionnaireScope) => {
      for (let i = 0; i < this.clickActions.length; i++) {
        this.clickActions[i](scope);
      }
    };

    buttonRepresentation.validate = (scope: QuestionnaireScope) => {
      for (let i = 0; i < this.validateActions.length; i++) {
        if (this.validateActions[i](scope) === false) {
          return false;
        }
      }
      return true;
    };
  }

  handleHelpTextElement(
    element: HelpTextElement,
    representation: NodeRepresentation
  ) {
    if (typeof element === "undefined" || element === null) {
      return;
    }

    const helpNode: HelpNode = {
      nodeName: "",
      next: "",
      nextFail: "",
      text: "",
    };

    if (element.text) {
      helpNode.helpText = element.text;
    }

    if (element.image) {
      helpNode.helpImage = element.image;
    }

    this.parserUtils.addHelpMenu(helpNode, representation);
  }

  onSubmit() {
    console.log(this.nodeForm.value);
  }

  get textInputControls() {
    return this.nodeForm.get("textInputControls") as FormArray<
      FormControl<string>
    >;
  }

  get inputControls() {
    return this.nodeForm.get("inputControls") as FormArray<FormControl<string>>;
  }

  isInteger(control: AbstractControl): ValidationErrors | null {
    const value: any = control.value === "" ? undefined : Number(control.value);
    if (Number.isInteger(value)) {
      console.debug("is Actually an integer");
      return null;
    } else {
      console.debug("is Actually not an integer");
      return {
        must_be_integer: `${value} is not an Integer`,
      };
    }
  }
}
