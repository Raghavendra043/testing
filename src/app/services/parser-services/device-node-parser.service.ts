import { Injectable } from "@angular/core";
import { DeviceMeasurementResponseMessage } from "src/app/types/native.type";
import { Button, QuestionnaireScope } from "src/app/types/model.type";
import { NativeEventListener } from "src/app/types/listener.type";
import {
  MeterParameter,
  MeterType,
  MeasurementType,
} from "src/app/types/meter.type";
import {
  DeviceNodeType,
  DynamicMeasurementNode,
  MeasurementNode,
  NodeModel,
  Representation,
  RepresentationType,
} from "src/app/types/parser.type";
import { exists } from "src/app/components/questionnaire-nodes/node-form-utils";
import { ParserUtilsService } from "./parser-utils.service";
import { MeterParameters } from "src/app/types/meter.type";
import { NativeService } from "../native-services/native.service";
import { DeviceListenerService } from "../device-listener-services/device-listener.service";

@Injectable({
  providedIn: "root",
})
export class DeviceNodeParserService {
  constructor(
    private parserUtils: ParserUtilsService,
    private native: NativeService,
    private deviceListenerService: DeviceListenerService,

  ) {}

  getMeasurementTypeNames = (meterType: MeterType): string[] => {
    const accumulateNames = (
      acc: string[],
      measurementType: MeasurementType
    ): string[] => {
      return acc.concat(
        // @ts-ignore
        measurementType.kind === "multiple"
          ? measurementType.values
          : [measurementType.value]
      );
    };

    const measurementTypes: string[] = meterType.measurementTypes.reduce(
      accumulateNames,
      []
    );

    return measurementTypes;
  };

  generateValidate = (
    measurementTypeNames: string[]
  ): ((scope: QuestionnaireScope) => boolean) => {
    return (scope: QuestionnaireScope): boolean => {
      const nodeModel: NodeModel = scope.representation.nodeModel;

      const checkMeasurementValues = (
        acc: boolean,
        measurementTypeName: string
      ): boolean => acc && exists(nodeModel[measurementTypeName]);

      const checkEnteredValues = (measurementTypeNames: string[]): boolean =>
        measurementTypeNames.reduce(checkMeasurementValues, true);

      return checkEnteredValues(measurementTypeNames);
    };
  };

  generateClickAction = (
    measurementTypeNames: string[],
    outputMapper: (measurements: string[], nodeModel: NodeModel) => string[],
    node: MeasurementNode
  ): ((scope: QuestionnaireScope) => void) => {
    return (scope: QuestionnaireScope) => {
      let measurements: string[] = measurementTypeNames.concat(["origin"]);

      if (exists(outputMapper)) {
        measurements = outputMapper(
          measurements,
          scope.representation.nodeModel
        );
      }

      this.parserUtils.addMeasurementCommentToOutput(
        scope.outputModel,
        scope.representation.nodeModel,
        node
      );

      this.parserUtils.addMeasurementsToOutput(
        scope.outputModel,
        scope.representation.nodeModel,
        node,
        measurements
      );
    };
  };

  generateRepresentationGenerator = (
    meterType: MeterType,
    deviceNodeType: DeviceNodeType
  ) => {
    const outputMapper = deviceNodeType.outputMapper;
    const measurementTypeNames: string[] =
      this.getMeasurementTypeNames(meterType);

    const generateRepresentation = (
      node: MeasurementNode,
      nodeModel: NodeModel
    ): Representation => {
      const leftButton: Button = {
        show: true,
        text: "SKIP",
        nextNodeId: node.nextFail,
      };

      const rightButton: Button = {
        show: true,
        text: "NEXT",
        nextNodeId: node.next,
        validate: this.generateValidate(measurementTypeNames),
        click: this.generateClickAction(
          measurementTypeNames,
          outputMapper,
          node
        ),
      };

      const representation: Representation = {
        kind: RepresentationType.NODE,
        nodeModel: nodeModel,
        leftButton: leftButton,
        rightButton: rightButton,
      };

      return representation;
    };

    return generateRepresentation;
  };

  create = (
    deviceNodeType: DeviceNodeType
  ): ((node: MeasurementNode) => Representation) => {
    const meterType = deviceNodeType.meterType;

    const generateRepresentation = this.generateRepresentationGenerator(
      meterType,
      deviceNodeType
    );

    return (node: MeasurementNode) => {
      const infoText = deviceNodeType.infoText;
      const nodeModel: NodeModel = {
        nodeId: node.nodeName,
        heading: node.text,
        progress: 0,
        info: exists(infoText) ? infoText : "CONNECTING",
      };

      if ("comment" in node) {
        nodeModel.comment = node.comment;
      }

      const eventListener: NativeEventListener =
        this.deviceListenerService.create(nodeModel, meterType);

      const nativeEventCallback = (
        message: DeviceMeasurementResponseMessage
      ): void => {
        const expectedMeterTypeName: string = deviceNodeType.meterType.name;

        if (message.meterType !== expectedMeterTypeName) {
          return;
        }

        eventListener(message.event);
      };

      const parameters: MeterParameters = {};
      meterType.parameters.forEach((parameter: MeterParameter) => {
        if (parameter in node) {
          const dynamicNode: DynamicMeasurementNode = node;
          parameters[parameter] = dynamicNode[parameter];
        }
      });

      this.native.subscribeToMultipleMessages(
        "deviceMeasurementResponse",
        nativeEventCallback
      );

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

      const representation: Representation = generateRepresentation(
        node,
        nodeModel
      );

      if ("helpMenu" in representation) {
        this.parserUtils.addHelpMenu(node, representation);
      }

      return representation;
    };
  };
}
