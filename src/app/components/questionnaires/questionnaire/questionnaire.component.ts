import {
  ComponentFactoryResolver,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NodeDirective } from 'src/app/directives/node.directive';
import { NativeService } from 'src/app/services/native-services/native.service';
import { NodesParserService } from 'src/app/services/parser-services/nodes-parser.service';
import { QuestionnairesService } from 'src/app/services/rest-api-services/questionnaires.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { Utils } from 'src/app/services/util-services/util.service';
import { NodeComponent, NodeItem } from 'src/app/types/nodes.type';
import {
  HelpMenu,
  Comment,
  AssignmentNode,
  NodeMap,
  OutputModel,
  OutputVariable,
  Representation,
  QuestionnaireNode,
  RepresentationType,
  QuestionnaireState,
} from 'src/app/types/parser.type';
import {
  Questionnaire,
  QuestionnaireRef,
} from '@app/types/questionnaires.type';
import {
  QuestionnaireModel,
  QuestionnaireScope,
  Button,
} from '@app/types/model.type';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.less'],
})
export class QuestionnaireComponent implements QuestionnaireScope, OnInit {
  public model: QuestionnaireModel = {
    title: '',
    state: 'Loading',
    error: undefined,
    submitNodeForm: () => void 0,
    commentPrompt: {
      visible: false,
      confirm: () => void 0,
    },
    showHelpMenuIcon: false,
    showHideHelpMenu: () => void 0,
    leftButton: {
      show: false,
      text: '',
      nextNodeId: '',
      validate: () => false,
      click: () => void 0,
    },
    centerButton: {
      show: false,
      text: '',
      nextNodeId: '',
      validate: () => false,
      click: () => void 0,
    },

    rightButton: {
      show: false,
      text: '',
      nextNodeId: '',
      validate: () => false,
      click: () => void 0,
    },
  };

  public outputModel: OutputModel = {};
  public nodeMap: NodeMap = {};
  nodeHistory: string[] = [];

  @ViewChild(NodeDirective, { static: true }) nodeHost!: NodeDirective;

  currentQuestionnaire!: Questionnaire;
  questionnaireRef!: QuestionnaireRef;
  public representation: Representation = {
    kind: RepresentationType.NODE,
    nodeModel: { nodeId: 'placeholder' },
  };
  public nodeForm: FormGroup | undefined;

  constructor(
    private appContext: StatePassingService,
    private utils: Utils,
    private questionnaires: QuestionnairesService,
    private native: NativeService,
    private translate: TranslateService,
    private router: Router,
    private nodesParserService: NodesParserService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (!this.appContext.requestParams.containsKey(SELECTED_QUESTIONNAIRE)) {
      void this.router.navigate(['/menu']);
      return;
    }

    this.questionnaireRef = this.appContext.requestParams.getAndClear(
      SELECTED_QUESTIONNAIRE
    );

    this.questionnaires
      .get(this.questionnaireRef)
      .then((result) => this.onSuccess(result))
      .catch((error) => this.onError(error));
  }

  loadComponent = (nextNodeId: string, nodeMap: NodeMap): Representation => {
    const { nodeToParse, nodeTypeName } = this.nodesParserService.getNode(
      nextNodeId,
      nodeMap
    );

    const nodeItem: NodeItem = this.nodesParserService.getComponent(
      nodeTypeName,
      nodeToParse[nodeTypeName],
      nodeMap,
      this
    );

    const viewContainerRef = this.nodeHost.viewContainerRef;
    viewContainerRef.clear();

    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(nodeItem.component);
    const componentRef =
      viewContainerRef.createComponent<NodeComponent>(componentFactory);

    componentRef.instance.node = nodeItem.node;
    componentRef.instance.nodeMap = nodeItem.nodeMap;
    componentRef.instance.scope = nodeItem.scope;
    componentRef.instance.parameters = nodeItem.parameters;

    this.nodeForm = componentRef.instance.nodeForm;
    const representation: Representation =
      componentRef.instance.getRepresentation();

    if (representation.kind === RepresentationType.SKIP) {
      return this.loadComponent(representation.nextNodeId, this.nodeMap);
    }

    this.representation = representation;
    return representation;
  };

  private forEachButtonDo = (action: (button: string) => void) => {
    ['leftButton', 'centerButton', 'rightButton'].forEach(action);
  };

  private setInitialNodeState = (): void => {
    this.forEachButtonDo((buttonName: string): void => {
      const button: Button = {
        show: false,
        text: '',
        nextNodeId: '',
        validate: () => true,
        click: () => ({}),
      };
      this.model[buttonName] = button;
    });

    if (this.utils.exists(this.nodeForm)) {
      this.nodeForm.markAsPristine();
    }
  };

  private collectOutputs = (): OutputVariable[] => {
    const outputs: OutputVariable[] = [];

    for (const nodeOutput in this.outputModel) {
      if (nodeOutput in this.outputModel) {
        outputs.push(this.outputModel[nodeOutput]);
      }
    }

    return outputs;
  };

  renderNode = (representation: Representation, nodeMap: NodeMap) => {
    const wrapValidate = (validate: (_: unknown) => boolean) => {
      return (): boolean => {
        if (this.utils.exists(validate)) {
          return validate(this);
        } else {
          return true;
        }
      };
    };

    const clickButton = (button: string, buttonRepresentation: Button) => {
      const clickAction = buttonRepresentation.click;

      const validate: ((scope: QuestionnaireScope) => boolean) | undefined =
        buttonRepresentation.validate;

      const comment: Comment | undefined =
        'nodeModel' in this.representation
          ? this.representation.nodeModel.comment
          : undefined;

      return () => {
        if (
          !this.utils.exists(validate) ||
          (this.utils.exists(validate) && validate(this))
        ) {
          const requestDelivered = this.native.removeDeviceListeners();
          if (!requestDelivered) {
            console.log(
              "Couldn't remove device listener due to missing native layer"
            );
          }
          const nodeModel: any = representation.nodeModel;

          const hasUnconfirmedOffendingValues = () => {
            if (
              button == 'rightButton' &&
              !this.utils.exists(nodeModel.offendingValues)
            ) {
              // First time patient clicks 'right (next) button' -> calculate offending values
              // if non-empty show warning otherwise continue.
              if (this.utils.exists(nodeModel.rangeCheck)) {
                nodeModel.offendingValues = nodeModel.rangeCheck(
                  representation.nodeModel
                );
                return nodeModel.offendingValues.length > 0;
              } else {
                nodeModel.offendingValues = [];
                return false;
              }
            } else {
              // Second time patient clicks 'right (confirm) button' -> continue
              nodeModel.offendingValues = [];
              return false;
            }
          };

          const continuation = () => {
            if (clickAction) {
              clickAction(this);
            }

            nodeModel.offendingValues = undefined;
            const nextNodeId = this.model[button].nextNodeId;
            this.nextNode(nextNodeId, nodeMap);
          };

          if (hasUnconfirmedOffendingValues()) {
            this.model.rightButton.text = this.translate.instant('CONFIRM');
            this.model.confirmTimeout = true;
            const CONFIRM_TIMEOUT_MILLIS = 3000;
            setTimeout(() => {
              this.model.confirmTimeout = false;
            }, CONFIRM_TIMEOUT_MILLIS);
          } else if (this.utils.exists(comment)) {
            this.renderCommentPrompt(comment, continuation);
          } else {
            continuation();
          }
        }
      };
    };

    const updateButtonModel = (buttonName: string) => {
      this.model[buttonName].show = true;
      this.model[buttonName].text = this.translate.instant(
        this.representation[buttonName].text
      );

      this.model[buttonName].nextNodeId =
        this.representation[buttonName].nextNodeId;
      this.model[buttonName].validate = wrapValidate(
        this.representation[buttonName].validate
      );

      this.model[buttonName].click = clickButton(
        buttonName,
        this.representation[buttonName]
      );
    };

    this.forEachButtonDo((buttonName: string) => {
      if (buttonName in this.representation) {
        updateButtonModel(buttonName);
      }
    });

    this.model.submitNodeForm = (): void => {
      if (this.model.rightButton.show && this.model.rightButton.click) {
        this.model.rightButton.click(this);
      } else if (
        this.model.centerButton.show &&
        this.model.centerButton.click
      ) {
        this.model.centerButton.click(this);
      }
    };

    const renderHelpMenu = (model: QuestionnaireModel): void => {
      if ('helpMenu' in this.representation) {
        model.showHelpMenuIcon = true;

        const helpMenu: HelpMenu = this.representation.helpMenu;
        model.helpMenu = helpMenu;
        model.helpMenu.visible = false;
        model.helpMenu.imageLoaded = false;

        if (helpMenu.image !== undefined) {
          this.questionnaires
            .getHelpImage({ imageUrl: helpMenu.image })
            .then((imageData: any) => {
              if (model.helpMenu !== undefined) {
                model.helpMenu.imageLoaded = true;
                model.helpMenu.imageSrc =
                  this.sanitizer.bypassSecurityTrustResourceUrl(
                    `data:image/png;charset=utf-8;base64,${imageData}`
                  );
              }
            })
            .catch((error: any) => {
              console.error(`Could not load help image due to error: ${error}`);
            });
        }
      } else {
        model.showHelpMenuIcon = false;
        delete model.helpMenu;
      }

      model.showHideHelpMenu = (): void => {
        if (this.utils.exists(model.helpMenu) && model.helpMenu.visible) {
          model.helpMenu.visible = false;
        } else {
          model.helpMenu.visible = true;
        }
      };
    };

    renderHelpMenu(this.model);
    console.log('Done renderNode');
    console.log(this.model);
  };

  refreshModel = (nextNodeId: string, nodeMap: NodeMap): void => {
    console.log('refreshModel');
    const representation: Representation = this.loadComponent(
      nextNodeId,
      nodeMap
    );

    this.setInitialNodeState();

    if (representation.kind == RepresentationType.END) {
      const questionnaireState: QuestionnaireState = {
        outputs: this.collectOutputs(),
        questionnaire: this.currentQuestionnaire,
        questionnaireRef: this.questionnaireRef,
        nodeHistory: this.nodeHistory,
        outputModel: this.outputModel,
      };

      this.appContext.requestParams.set(
        QUESTIONNAIRE_STATE,
        questionnaireState
      );

      const id = this.appContext.requestParams.get('questionnaireId');
      this.router.navigate(['questionnaires', id, 'send_reply']);
    } else {
      this.renderNode(representation, nodeMap);
    }
  };

  renderCommentPrompt = (comment: Comment, continuation: Function): void => {
    this.model.commentPrompt = {
      visible: true,
      text: '',
      confirm: () => {
        let commentText = this.model.commentPrompt?.text;
        if (this.utils.exists(commentText)) {
          commentText = commentText.trim();
        } else {
          commentText = '';
        }
        comment.text = commentText;

        this.model.commentPrompt.visible = false;
        continuation();
      },
    };
  };

  /**
   * Called when going back in a questionnaire. Refreshes the questionnaire state
   * based on the `nodeHistory` recorded.
   *
   */
  private refreshFromHistory = (nodeMap: NodeMap): void => {
    const nodeHistory = this.nodeHistory;
    this.clearOutputFromHistory(nodeHistory, this.outputModel, nodeMap);

    // Go back to previous node / page
    if (nodeHistory.length === 0) {
      globalThis.history.back();
    } else {
      const previousNodeId = nodeHistory[nodeHistory.length - 1];
      this.refreshModel(previousNodeId, nodeMap);
    }
  };

  /**
   * Wipes any variables set in the `outputModel` by any `AssignmentNode`
   * variables that have been set between now and the previous interactive
   * node.
   *
   * Has no return value as it mutates the `outputModel`.
   */
  private clearOutputFromHistory = (
    nodeHistory: string[],
    outputModel: OutputModel,
    nodeMap: NodeMap
  ): void => {
    const previousNodeId: string | undefined = nodeHistory.pop();
    if (!this.utils.exists(previousNodeId)) {
      return;
    }
    let candidateNode = nodeMap[previousNodeId];

    while ('AssignmentNode' in candidateNode) {
      const assignmentNode: AssignmentNode =
        candidateNode.AssignmentNode as AssignmentNode;
      delete outputModel[assignmentNode.variable.name];
      candidateNode = nodeMap[assignmentNode.next];
    }
  };

  /**
   * Used for checking whether an entered input value is outside of the normal
   * range (if specified).
   */

  public hasOffendingValue = (valueName: string) => {
    return (
      this.utils.exists(this.representation.nodeModel.offendingValues) &&
      this.representation.nodeModel.offendingValues.indexOf(valueName) >= 0
    );
  };

  public nextNode = (nodeId: string, nodeMap: NodeMap): void => {
    this.nodeHistory.push(nodeId);
    if (nodeId === RepresentationType.UNSUPPORTED) {
      console.debug(
        `NodeId specified as ${RepresentationType.UNSUPPORTED}. Returning`
      );
      return;
    } else {
      this.refreshModel(nodeId, nodeMap);
    }
  };

  toNodeMap = (nodes: Array<Record<string, QuestionnaireNode>>): NodeMap => {
    const getFirstKeyFromLiteral = (
      literal: Record<string, QuestionnaireNode>
    ) => {
      for (const key in literal) {
        if (Object.prototype.hasOwnProperty.call(literal, key)) {
          return key;
        }
      }

      return undefined;
    };

    const nodeMap: NodeMap = {};

    nodes.forEach((node: Record<string, QuestionnaireNode>) => {
      const key: string | undefined = getFirstKeyFromLiteral(node);
      if (key !== undefined) {
        nodeMap[node[key].nodeName] = node;
      }
    });

    return nodeMap;
  };

  onSuccess = (questionnaire: Questionnaire): void => {
    this.model.state = 'Loaded';
    this.currentQuestionnaire = questionnaire;
    this.model.title = this.currentQuestionnaire.name;
    this.nodeMap = this.toNodeMap(questionnaire.nodes);
    const startNode: string = questionnaire.startNode;
    this.nodesParserService.validate(this.nodeMap);

    if (this.appContext.requestParams.containsKey(QUESTIONNAIRE_STATE)) {
      const state =
        this.appContext.requestParams.getAndClear<QuestionnaireState>(
          QUESTIONNAIRE_STATE
        );
      this.nodeHistory = state.nodeHistory;
      this.outputModel = state.outputModel;
      this.refreshFromHistory(this.nodeMap);
    } else {
      this.nextNode(startNode, this.nodeMap);
    }
  };

  onError = (data: any) => {
    this.model.state = 'Failed';
    console.error(`Failed to load questionnaire due to error: ${data}`);
    this.model.error = data.message;
    this.model.centerButton = {
      show: true,
      text: 'OK',
      validate: () => {
        return true;
      },
    };
    this.model.rightButton.click = () => {
      this.router.navigate(['/menu']);
    };
  };

  goBack = (): void => {
    const requestDelivered = this.native.removeDeviceListeners();
    if (!requestDelivered) {
      console.debug(
        "Couldn't remove device listener due to missing native layer"
      );
    }

    this.refreshFromHistory(this.nodeMap);
  };

  goHome = (): void => {
    const requestDelivered = this.native.removeDeviceListeners();
    if (!requestDelivered) {
      console.debug(
        "Couldn't remove device listener due to missing native layer"
      );
    }

    this.router.navigate(['/menu']);
  };
}

const QUESTIONNAIRE_STATE = 'questionnaireState';
const SELECTED_QUESTIONNAIRE = 'selectedQuestionnaire';
