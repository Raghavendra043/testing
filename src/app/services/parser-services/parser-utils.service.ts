import { Injectable } from '@angular/core';
import {
  DynamicMeasurementNode,
  DynamicNodeModel,
  HelpMenu,
  MeasurementNode,
  NodeElement,
  NodeModel,
  NodeWrapper,
  OutputModel,
  NodeRepresentation,
  InputRange,
  NodeValueEntry,
} from 'src/app/types/parser.type';

@Injectable({
  providedIn: 'root',
})
export class ParserUtilsService {
  constructor() {}

  getFirstKeyFromLiteral(
    literal: NodeWrapper | NodeElement
  ): string | undefined {
    for (const key in literal) {
      if (literal.hasOwnProperty(key)) {
        return key;
      }
    }
    return undefined;
  }

  getNodeTypeName(node: NodeWrapper): string | undefined {
    return this.getFirstKeyFromLiteral(node);
  }

  getElementType(element: NodeElement): string | undefined {
    return this.getFirstKeyFromLiteral(element);
  }

  hashCode(str: string): number {
    let hash = 0;
    let chr = 0;

    if (str.length === 0) {
      return hash;
    }

    for (let i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }

    return Math.abs(hash);
  }

  replaceAll = (str: string, find: string, replace: string) => {
    const escapeRegExp = (str: string) =>
      str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');

    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  };

  /**
   * Given a set of node measurement value names (like 'systolic', 'diastolic',
   * and 'pulse' for the 'BloodPressureManualDeviceNode' node type or
   * 'temperature' for 'TemperatureManualDeviceNode') the function then checks
   * whether each of the given values are within the optionally specified input
   * range and if not adds the offending name to the return value.
   */

  measurementsNoRangeCheck = ['mealIndicator'];

  checkInputRanges = (
    valueNames: string[],
    node: DynamicMeasurementNode,
    nodeModel: DynamicNodeModel
  ): string[] =>
    valueNames.reduce((acc: string[], nodeTypeName: string) => {
      const measurementType: NodeValueEntry = node[nodeTypeName];
      if (
        measurementType === undefined &&
        this.measurementsNoRangeCheck.includes(nodeTypeName)
      ) {
        console.debug(`Skipping range check for: ${nodeTypeName}`);
        return acc;
      }
      if (measurementType === undefined) {
        console.error(`Unable to find ${nodeTypeName} on current node`);
        return acc;
      }

      const range: InputRange | undefined = measurementType.range;
      if (range == undefined) {
        return acc;
      } else {
        const min = range.min;
        const max = range.max;
        console.debug(`Valid range for "${nodeTypeName}": [${min}, ${max}]`);
        const value = nodeModel[nodeTypeName];

        if (value === undefined && !0) {
          console.error(`Value of ${nodeTypeName} is undefined`);
        } else {
          console.debug(`${nodeTypeName} value: ${value}`);
        }

        const withinRange = min <= value && value <= max;
        if (!withinRange) {
          return acc.concat(nodeTypeName);
        } else {
          return acc;
        }
      }
    }, []);

  addManualMeasurementOriginToOutput(
    outputModel: OutputModel,
    node: MeasurementNode
  ): void {
    if (node.origin) {
      const originName = node.origin.name;
      const originType = node.origin.type;
      const originValue = {
        manualMeasurement: {
          enteredBy: 'citizen',
        },
      };

      outputModel[originName] = {
        name: originName,
        type: originType,
        value: originValue,
      };
    }
  }

  addMeasurementCommentToOutput(
    outputModel: OutputModel,
    nodeModel: NodeModel,
    node: MeasurementNode
  ): void {
    if (node.comment) {
      const commentName = node.comment.name;
      const commentType = node.comment.type;
      const commentValue = nodeModel.comment?.text;

      outputModel[commentName] = {
        name: commentName,
        type: commentType,
        value: commentValue,
      };
    }
  }

  addMeasurementsToOutput(
    outputModel: OutputModel,
    nodeModel: DynamicNodeModel,
    node: DynamicMeasurementNode,
    measurements: string[]
  ): void {
    measurements.forEach((measurement: string) => {
      const measurementName: string = node[measurement].name;
      const measurementType: string = node[measurement].type;
      const measurementValue: any = nodeModel[measurement];

      outputModel[measurementName] = {
        name: measurementName,
        type: measurementType,
        value: measurementValue,
      };
    });
  }

  addHelpMenu(node: MeasurementNode, representation: NodeRepresentation): void {
    const helpMenu: HelpMenu = {
      text: undefined,
      image: undefined,
    };

    if (node.helpText) {
      helpMenu.text = node.helpText;
    }

    if (node.helpImage) {
      helpMenu.image = node.helpImage;
    }

    if (helpMenu.text !== undefined || helpMenu.image !== undefined) {
      representation.helpMenu = helpMenu;
    } else {
      delete representation.helpMenu;
    }
  }
}
