import { Component, Input } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { NodeComponent, ComponentParameters } from 'src/app/types/nodes.type';
import { Button, QuestionnaireScope } from 'src/app/types/model.type';
import {
  Choice,
  MultipleChoiceQuestionNode,
  MultipleChoiceQuestionNodeModel,
  NodeMap,
  NodeParserFunction,
  NodeRepresentation,
  Representation,
  RepresentationType,
} from 'src/app/types/parser.type';

@Component({
  selector: 'app-multiple-choice-question-node',
  templateUrl: './multiple-choice-question-node.component.html',
  styleUrls: ['./multiple-choice-question-node.component.less'],
})
export class MultipleChoiceQuestionNodeComponent implements NodeComponent {
  @Input() node!: MultipleChoiceQuestionNode;
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
    const parseNode: NodeParserFunction<MultipleChoiceQuestionNode> = (
      node,
      _nodeMap,
      outputModel
    ): Representation => {
      const nodeModel: MultipleChoiceQuestionNodeModel = {
        nodeId: node.nodeName,
        heading: node.question,
        choices: node.answer.choices,
      };

      for (const { next, ...choice } of nodeModel.choices) {
        this.choices.push(choice);
      }

      const getSelectedIndex = (): number => {
        return this.nodeForm.getRawValue().selectedIndex ?? -1;
      };

      const getSelectedNode = (
        nodeModel: MultipleChoiceQuestionNodeModel
      ): Choice => {
        const index = getSelectedIndex();
        return nodeModel.choices[index];
      };

      const clickAction = (): void => {
        const outputName = node.answer.name;
        const outputType = node.answer.type;
        const selectedNode = getSelectedNode(nodeModel);

        outputModel[outputName] = {
          name: outputName,
          type: outputType,
          value: selectedNode.value,
        };
      };

      const centerButton: Button = {
        show: true,
        text: 'NEXT',
        nextNodeId: node.next,
        click: clickAction,
        validate: () => !this.nodeForm.invalid, //scope.nodeForm.$dirty,
      };

      const representation: NodeRepresentation = {
        kind: RepresentationType.NODE,
        nodeModel: nodeModel,
        centerButton: centerButton,
        selectedIndex: getSelectedIndex(),
      };

      return representation;
    };

    return parseNode(this.node, this.nodeMap, this.scope.outputModel);
  }

  onSubmit() {
    console.log(this.nodeForm.value);
  }

  get selectedIndex() {
    return this.nodeForm.get('selectedIndex') as FormControl;
  }
}
