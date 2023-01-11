import { Component, Input } from "@angular/core";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { NodeComponent, ComponentParameters } from "src/app/types/nodes.type";
import { Button, QuestionnaireScope } from "src/app/types/model.type";
import {
  Choice,
  MultipleChoiceNode,
  MultipleChoiceNodeModel,
  NodeMap,
  NodeParserFunction,
  NodeRepresentation,
  Representation,
  RepresentationType,
} from "src/app/types/parser.type";

@Component({
  selector: "app-multiple-choice-node",
  templateUrl: "./multiple-choice-node.component.html",
  styleUrls: ["./multiple-choice-node.component.less"],
})
export class MultipleChoiceNodeComponent implements NodeComponent {
  @Input() node!: MultipleChoiceNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  choices: { text?: string; value: string }[] = [];
  nodeForm = this.formBuilder.group({
    selectedIndex: [
      -1,
      Validators.compose([Validators.required, Validators.min(0)]),
    ],
  });

  constructor(private formBuilder: NonNullableFormBuilder) {}

  getRepresentation(): Representation {
    const parseNode: NodeParserFunction<MultipleChoiceNode> = (
      node,
      _nodeMap,
      _outputModel
    ) => {
      const nodeModel: MultipleChoiceNodeModel = {
        nodeId: node.nodeName,
        heading: node.question,
        choices: node.answer.choices,
      };

      for (const choice of nodeModel.choices) {
        const { next, ...element } = choice;
        this.choices.push(element);
      }

      const getSelectedIndex = (): number => {
        return this.nodeForm.value.selectedIndex ?? -1;
      };

      const getSelectedNode = function (): Choice {
        const index = getSelectedIndex();
        return nodeModel.choices[index];
      };

      const getNextNodeId = (): string => {
        if (node.branchOnChoices) {
          const nextNode = getSelectedNode();
          return nextNode.next;
        } else {
          return node.next!;
        }
      };

      const nodeName = node.nodeName;

      const clickAction = (scope: QuestionnaireScope) => {
        const answerName = node.answer.name;
        const answerType = node.answer.type;
        const nextNodeId = getNextNodeId();

        const selectedNode: Choice = getSelectedNode();
        scope.model.centerButton.nextNodeId = nextNodeId;
        //@ts-ignore
        scope.outputModel[nodeName] = {
          name: answerName,
          type: answerType,
          value: selectedNode.value,
        };
      };

      const centerButton: Button = {
        show: true,
        text: "NEXT",
        click: clickAction,
        validate: () => !this.nodeForm.invalid,
      };
      //@ts-ignore
      const representation: NodeRepresentation = {
        kind: RepresentationType.NODE,
        nodeModel: nodeModel,
        centerButton: centerButton,
        ...this.nodeForm.value,
      };

      return representation;
    };

    return parseNode(this.node, this.nodeMap, this.scope.outputModel);
  }

  onSubmit() {
    console.log(this.nodeForm.value);
  }

  get selectedIndex() {
    const selectedIndex = this.nodeForm.get("selectedIndex");

    if (selectedIndex === null) {
      throw new Error("No form control for selectedIndex");
    }

    return selectedIndex;
  }
}
