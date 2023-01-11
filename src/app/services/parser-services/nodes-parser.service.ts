import { Injectable } from '@angular/core';
import { ActivityManualDeviceNodeComponent } from 'src/app/components/questionnaire-nodes/manual/activity-manual-device-node/activity-manual-device-node.component';
import { BloodPressureManualDeviceNodeComponent } from 'src/app/components/questionnaire-nodes/manual/blood-pressure-manual-device-node/blood-pressure-manual-device-node.component';
import { BloodSugarManualDeviceNodeComponent } from 'src/app/components/questionnaire-nodes/manual/blood-sugar-manual-device-node/blood-sugar-manual-device-node.component';
import { BloodSugarMGDLManualDeviceNodeComponent } from 'src/app/components/questionnaire-nodes/manual/blood-sugar-mgdl-manual-device-node/blood-sugar-mgdl-manual-device-node.component';
import { CrpManualDeviceNodeComponent } from 'src/app/components/questionnaire-nodes/manual/crp-manual-device-node/crp-manual-device-node.component';
import { EnumDeviceNodeComponent } from 'src/app/components/questionnaire-nodes/manual/enum-device-node/enum-device-node.component';
import { IONodeComponent } from 'src/app/components/questionnaire-nodes/manual/ionode/ionode.component';
import { PainScaleManualDeviceNodeComponent } from 'src/app/components/questionnaire-nodes/manual/pain-scale-manual-device-node/pain-scale-manual-device-node.component';
import { SaturationManualDeviceNodeComponent } from 'src/app/components/questionnaire-nodes/manual/saturation-manual-device-node/saturation-manual-device-node.component';
import { SaturationWithoutPulseManualDeviceNodeComponent } from 'src/app/components/questionnaire-nodes/manual/saturation-without-pulse-manual-device-node/saturation-without-pulse-manual-device-node.component';
import { SpirometerManualDeviceNodeComponent } from 'src/app/components/questionnaire-nodes/manual/spirometer-manual-device-node/spirometer-manual-device-node.component';
import { AssignmentNodeComponent } from 'src/app/components/questionnaire-nodes/other/assignment-node/assignment-node.component';
import { DecisionNodeComponent } from 'src/app/components/questionnaire-nodes/other/decision-node/decision-node.component';
import { EndNodeComponent } from 'src/app/components/questionnaire-nodes/other/end-node/end-node.component';
import { ManualDeviceNodeComponent } from '@components/questionnaire-nodes/manual/manual-device-node/manual-device-node.component';
import { AutomaticDeviceNodeComponent } from 'src/app/components/questionnaire-nodes/automatic/automatic-device-node/automatic-device-node.component';
import { MultipleChoiceNodeComponent } from 'src/app/components/questionnaire-nodes/multiple-choice/multiple-choice-node/multiple-choice-node.component';
import { MultipleChoiceQuestionNodeComponent } from 'src/app/components/questionnaire-nodes/multiple-choice/multiple-choice-question-node/multiple-choice-question-node.component';
import { MultipleChoiceSummationNodeComponent } from 'src/app/components/questionnaire-nodes/multiple-choice/multiple-choice-summation-node/multiple-choice-summation-node.component';
import { DelayNodeComponent } from 'src/app/components/questionnaire-nodes/other/delay-node/delay-node.component';
import {
  AutomaticNodeTypeName,
  NodeItem,
  NodeType,
  NodeTypeName,
} from 'src/app/types/nodes.type';
import { meterTypes } from 'src/app/types/meter.type';
import {
  QuestionnaireNode,
  NodeMap,
  NodeWrapper,
} from 'src/app/types/parser.type';
import { QuestionnaireScope } from 'src/app/types/model.type';
import { ParserUtilsService } from './parser-utils.service';
import { UnsupportedNodeComponent } from '@components/questionnaire-nodes/other/unsupported-node/unsupported-node.component';
import { EcgDeviceNodeComponent } from '@components/questionnaire-nodes/automatic/ecg-device-node/ecg-device-node.component';
import { NativeService } from '@services/native-services/native.service';

@Injectable({
  providedIn: 'root',
})
export class NodesParserService {
  constructor(
    private parserUtils: ParserUtilsService,
    private native: NativeService
  ) {}

  getComponent(
    nodeTypeName: NodeTypeName,
    node: QuestionnaireNode,
    nodeMap: NodeMap,
    scope: QuestionnaireScope
  ): NodeItem {
    console.debug(`getComponent: ${nodeTypeName}`);
    const nativeIsAvailable = this.native.isAvailable();
    if (
      //@ts-ignore
      Object.values(AutomaticNodeTypeName).includes(nodeTypeName) &&
      !nativeIsAvailable
    ) {
      console.error(
        `No native available for the automatic device node: ${nodeTypeName}`
      );

      return new NodeItem(UnsupportedNodeComponent, node, nodeMap, scope, {
        type: NodeType.AUTOMATIC,
        nodeTypeName: nodeTypeName,
        noNative: 'true',
      });
    }

    switch (nodeTypeName) {
      case NodeTypeName.ACTIVITY_DEVICE_NODE: {
        return new NodeItem(
          AutomaticDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {
            meterTypeName: meterTypes.ACTIVITY_TRACKER.name,
            nodeTypeName: nodeTypeName,
          }
        );
      }

      case NodeTypeName.BLOOD_PRESSURE_DEVICE_NODE: {
        return new NodeItem(
          AutomaticDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {
            meterTypeName: meterTypes.BLOOD_PRESSURE_MONITOR.name,
            nodeTypeName: nodeTypeName,
          }
        );
      }

      case NodeTypeName.BLOOD_SUGAR_DEVICE_NODE: {
        return new NodeItem(
          AutomaticDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {
            meterTypeName: meterTypes.GLUCOMETER.name,
            nodeTypeName: nodeTypeName,
          }
        );
      }

      case NodeTypeName.SATURATION_DEVICE_NODE: {
        return new NodeItem(
          AutomaticDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {
            meterTypeName: meterTypes.OXIMETER.name,
            nodeTypeName: nodeTypeName,
          }
        );
      }

      case NodeTypeName.SATURATION_WITHOUT_PULSE_DEVICE_NODE: {
        return new NodeItem(
          AutomaticDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {
            meterTypeName: meterTypes.OXIMETER.name,
            nodeTypeName: nodeTypeName,
          }
        );
      }

      case NodeTypeName.SPIROMETER_DEVICE_NODE: {
        return new NodeItem(
          AutomaticDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {
            meterTypeName: meterTypes.SPIROMETER.name,
            nodeTypeName: nodeTypeName,
          }
        );
      }

      case NodeTypeName.TEMPERATURE_DEVICE_NODE: {
        return new NodeItem(
          AutomaticDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {
            meterTypeName: meterTypes.THERMOMETER.name,
            nodeTypeName: nodeTypeName,
          }
        );
      }

      case NodeTypeName.WEIGHT_DEVICE_NODE: {
        return new NodeItem(
          AutomaticDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {
            meterTypeName: meterTypes.WEIGHT_SCALE.name,
            nodeTypeName: nodeTypeName,
          }
        );
      }

      case NodeTypeName.OXYGEN_FLOW_DEVICE_NODE: {
        return new NodeItem(
          AutomaticDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {
            meterTypeName: meterTypes.OXYGEN_FLOW.name,
            nodeTypeName: nodeTypeName,
          }
        );
      }

      case NodeTypeName.ECG_DEVICE_NODE: {
        return new NodeItem(EcgDeviceNodeComponent, node, nodeMap, scope, {});
      }

      // Unsupported automatic node types
      case NodeTypeName.BLOOD_SUGAR_MGDL_DEVICE_NODE:
      case NodeTypeName.FEMOM_DEVICE_NODE:
      case NodeTypeName.PULSE_DEVICE_NODE:
      case NodeTypeName.RESPIRATORY_RATE_DEVICE_NODE:
      case NodeTypeName.TEMPERATURE_FAHRENHEIT_DEVICE_NODE:
      case NodeTypeName.WEIGHT_POUND_DEVICE_NODE: {
        return new NodeItem(UnsupportedNodeComponent, node, nodeMap, scope, {
          type: NodeType.AUTOMATIC,
          nodeTypeName: nodeTypeName,
        });
      }

      // Manual measurements
      case NodeTypeName.ACTIVITY_MANUAL_DEVICE_NODE: {
        return new NodeItem(
          ActivityManualDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      case NodeTypeName.BLOOD_SUGAR_MANUAL_DEVICE_NODE: {
        return new NodeItem(
          BloodSugarManualDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      case NodeTypeName.BLOOD_SUGAR_MGDL_MANUAL_DEVICE_NODE: {
        return new NodeItem(
          BloodSugarMGDLManualDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      case NodeTypeName.BLOOD_PRESSURE_MANUAL_DEVICE_NODE: {
        return new NodeItem(
          BloodPressureManualDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      case NodeTypeName.PEAK_FLOW_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'peakFlow',
        });
      }

      case NodeTypeName.PULSE_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'pulse',
        });
      }

      case NodeTypeName.RESPIRATORY_RATE_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'respiratoryRate',
        });
      }

      case NodeTypeName.SIT_TO_STAND_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'sitToStand',
        });
      }

      case NodeTypeName.TEMPERATURE_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'temperature',
        });
      }

      case NodeTypeName.TEMPERATURE_FAHRENHEIT_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'temperatureFahrenheit',
        });
      }

      case NodeTypeName.WEIGHT_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'weight',
        });
      }

      case NodeTypeName.WEIGHT_POUND_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'weightPound',
        });
      }

      case NodeTypeName.OXYGEN_FLOW_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'oxygenFlow',
        });
      }

      case NodeTypeName.HEIGHT_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'height',
        });
      }

      case NodeTypeName.BODY_CELL_MASS_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'bodyCellMass',
        });
      }

      case NodeTypeName.FAT_MASS_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'fatMass',
        });
      }

      case NodeTypeName.PHASE_ANGLE_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'phaseAngle',
        });
      }

      case NodeTypeName.PAIN_SCALE_MANUAL_DEVICE_NODE: {
        return new NodeItem(
          PainScaleManualDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      case NodeTypeName.CRP_MANUAL_DEVICE_NODE: {
        return new NodeItem(
          CrpManualDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      case NodeTypeName.SATURATION_MANUAL_DEVICE_NODE: {
        return new NodeItem(
          SaturationManualDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      case NodeTypeName.SATURATION_WITHOUT_PULSE_MANUAL_DEVICE_NODE: {
        return new NodeItem(
          SaturationWithoutPulseManualDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      case NodeTypeName.SPIROMETER_MANUAL_DEVICE_NODE: {
        return new NodeItem(
          SpirometerManualDeviceNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      case NodeTypeName.HEMOGLOBIN_MANUAL_DEVICE_NODE: {
        return new NodeItem(ManualDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'hemoglobin',
        });
      }

      // Enum nodes
      case NodeTypeName.URINE_MANUAL_DEVICE_NODE: {
        return new NodeItem(EnumDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'urine',
        });
      }

      case NodeTypeName.GLUCOSE_URINE_MANUAL_DEVICE_NODE: {
        return new NodeItem(EnumDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'glucoseUrine',
        });
      }

      case NodeTypeName.BLOOD_URINE_MANUAL_DEVICE_NODE: {
        return new NodeItem(EnumDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'bloodUrine',
        });
      }

      case NodeTypeName.LEUKOCYTES_URINE_MANUAL_DEVICE_NODE: {
        return new NodeItem(EnumDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'leukocytesUrine',
        });
      }

      case NodeTypeName.NITRITE_URINE_MANUAL_DEVICE_NODE: {
        return new NodeItem(EnumDeviceNodeComponent, node, nodeMap, scope, {
          parserTypeName: 'nitriteUrine',
        });
      }

      // Multiple choice nodes
      case NodeTypeName.MULTIPLE_CHOICE_NODE: {
        return new NodeItem(
          MultipleChoiceNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      case NodeTypeName.MULTIPLE_CHOICE_QUESTION_NODE: {
        return new NodeItem(
          MultipleChoiceQuestionNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      case NodeTypeName.MULTIPLE_CHOICE_SUMMATION_NODE: {
        return new NodeItem(
          MultipleChoiceSummationNodeComponent,
          node,
          nodeMap,
          scope,
          {}
        );
      }

      // Other nodes
      case NodeTypeName.DELAY_NODE: {
        return new NodeItem(DelayNodeComponent, node, nodeMap, scope, {});
      }

      case NodeTypeName.IO_NODE: {
        return new NodeItem(IONodeComponent, node, nodeMap, scope, {});
      }

      case NodeTypeName.ASSIGNMENT_NODE: {
        return new NodeItem(AssignmentNodeComponent, node, nodeMap, scope, {});
      }

      case NodeTypeName.DECISION_NODE: {
        return new NodeItem(DecisionNodeComponent, node, nodeMap, scope, {});
      }

      case NodeTypeName.END_NODE: {
        return new NodeItem(EndNodeComponent, node, nodeMap, scope, {});
      }
      default: {
        console.error(`Unable to get component of nodeType: ${nodeTypeName}`);
        return new NodeItem(UnsupportedNodeComponent, node, nodeMap, scope, {
          type: NodeType.UNKNOWN,
          nodeTypeName: nodeTypeName,
        });
      }
    }
  }

  getNode(
    currentNodeId: string,
    nodeMap: NodeMap
  ): { nodeToParse: NodeWrapper; nodeTypeName: NodeTypeName } {
    const nodeToParse: NodeWrapper = nodeMap[currentNodeId];
    const nodeTypeName: string = this.parserUtils.getNodeTypeName(nodeToParse)!;

    if (!this.hasParser(nodeTypeName)) {
      throw new TypeError(`Node of type ${nodeTypeName} not supported`);
    }

    return { nodeToParse: nodeToParse, nodeTypeName: nodeTypeName };
  }

  hasParser(nodeTypeName: string): nodeTypeName is NodeTypeName {
    return Object.values(NodeTypeName).includes(nodeTypeName as NodeTypeName);
  }

  validate = (nodeMap: NodeMap) => {
    const errorTypes: string[] = [];

    const nodes: NodeWrapper[] = [];
    for (const nodeId in nodeMap) {
      if (nodeMap.hasOwnProperty(nodeId)) {
        nodes.push(nodeMap[nodeId]);
      }
    }

    if (nodes.length === 0) {
      throw new TypeError('Questionnaire Node list was empty.');
    }

    nodes.forEach((node: NodeWrapper) => {
      const nodeTypeName: string = this.parserUtils.getNodeTypeName(node)!;
      if (!this.hasParser(nodeTypeName)) {
        errorTypes.push(nodeTypeName);
      }
    });

    if (errorTypes.length > 0) {
      const error: any = new TypeError(
        `The following Node types are not supported: ${errorTypes}`
      );

      throw error;
    }
  };
}
