// @ts-nocheck
import { ApplicationRef, Component, Input } from '@angular/core';
import { Message } from 'src/app/types/native.type';
import { meterTypes } from '@app/types/meter.type';
import { Callback } from '@app/types/native.type';
import { NodeComponent } from 'src/app/types/nodes.type';
import {
  Button,
  QuestionnaireScope,
  ECGNode,
  ECGNodeModel,
  Representation,
} from '@app/types/parser.type';
import { exists } from '@components/questionnaire-nodes/node-form-utils';
import { Idle } from '@ng-idle/core';
import { DeviceListenerService } from '@services/device-listener-services/device-listener.service';
import { NativeService } from '@services/native-services/native.service';
import { ParserUtilsService } from '@services/parser-services/parser-utils.service';

@Component({
  selector: 'app-ecg-device-node',
  templateUrl: './ecg-device-node.component.html',
  styleUrls: ['./ecg-device-node.component.less'],
})
export class EcgDeviceNodeComponent implements NodeComponent {
  @Input() node: any = undefined;
  @Input() nodeMap: any = undefined;
  @Input() outputModel: any = undefined;

  //Form
  nodeModel: ECGNodeModel | undefined = undefined;
  constructor(
    private parserUtils: ParserUtilsService,
    private idle: Idle,
    private native: NativeService,
    private deviceListener: DeviceListenerService,
    private applicationRef: ApplicationRef
  ) {}

  generateRepresentation = (node: ECGNode, nodeModel: ECGNodeModel) => {
    const leftButton: Button = {
      text: 'SKIP',
      nextNodeId: node.nextFail,
    };

    const createRightButton = () => {
      const validateRightButton = (scope: QuestionnaireScope) => {
        if ('samples' in this.nodeModel) {
          const nodeModel: ECGNodeModel = this.nodeModel;
          return (
            exists(nodeModel.startTime) &&
            exists(nodeModel.duration) &&
            exists(nodeModel.frequency) &&
            exists(nodeModel.rrIntervals) &&
            exists(nodeModel.samples)
          );
        } else {
          return false;
        }
      };

      const clickActionRightButton = (scope: QuestionnaireScope) => {
        const measurements = [
          'startTime',
          'duration',
          'frequency',
          'rrIntervals',
          'samples',
          'origin',
        ];

        this.startIdleWatcher();
        this.parserUtils.addMeasurementsToOutput(
          scope.outputModel,
          nodeModel,
          node,
          measurements
        );

        this.parserUtils.addMeasurementCommentToOutput(
          scope.outputModel,
          nodeModel,
          node
        );
      };

      return {
        text: 'NEXT',
        nextNodeId: node.next,
        validate: validateRightButton,
        click: clickActionRightButton,
      };
    };

    const rightButton: Button = createRightButton();

    const representation: Representation = {
      nodeModel: nodeModel,
      leftButton: leftButton,
      rightButton: rightButton,
    };

    return representation;
  };

  getRepresentation(): Representation {
    const sampleTimeInSeconds = this.node.sampleTimeInSeconds;

    this.nodeModel = {
      heading: this.node.text,
      comment: this.node.comment,
      info: 'CONNECTING',

      sampleTime: sampleTimeInSeconds,
      remaining: sampleTimeInSeconds,
      progress: 0,
    };

    this.nodeModel.setValue = (key: string, value: any): void => {
      // Bit of a hack we have to use in order to trigger the re-rendering and
      // re-validation of the questionnaire form upon receiving a
      // status/measurement from the native layer.
      if (this.nodeModel !== undefined) {
        this.nodeModel[key] = value;
        this.applicationRef.tick();
      }
    };

    const meterType = meterTypes.ECG;

    const parameters = Object.freeze({
      sampleTimeInSeconds: sampleTimeInSeconds,
    });

    const eventListener = this.deviceListener.create(this.nodeModel, meterType);

    const nativeEventCallback: Callback = (message: Message) => {
      if (message.meterType !== meterType.name) {
        return;
      } else if (message.event !== undefined) {
        eventListener(message.event);
      }
    };

    const listenerAdded = this.native.addDeviceListener(
      meterType.name,
      parameters
    );
    if (!listenerAdded) {
      const error: any = new Error(
        `Could not add device listener for ${meterType.name}`
      );
      throw error;
    }

    this.native.subscribeToMultipleMessages(
      'deviceMeasurementResponse',
      nativeEventCallback
    );

    this.idle.stop();

    const representation: Representation = this.generateRepresentation(
      this.node,
      this.nodeModel
    );
    this.parserUtils.addHelpMenu(this.node, representation);

    return representation;
  }

  startIdleWatcher(): void {
    if (this.idle.isRunning()) {
      return;
    }
    this.idle.watch();
  }
}
