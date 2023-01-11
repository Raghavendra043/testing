import { Injectable } from "@angular/core";
import {
  NativeEvent,
  EventType,
  NativeEventListener,
  Measurement,
  MeasurementHandler,
  StatusType,
  Status,
  StatusHandler,
} from "@app/types/listener.type";
import { MeasurementType, MeterType } from "@app/types/meter.type";
import { NodeModel } from "@app/types/parser.type";
import { exists } from "@components/questionnaire-nodes/node-form-utils";

@Injectable({
  providedIn: "root",
})
export class DeviceListenerService {
  private statusEventHandlers = new Map<StatusType, StatusHandler>([
    [
      StatusType.INFO,
      (nodeModel: NodeModel, status: Status): void => {
        if (status.type == StatusType.INFO) {
          this.setNodeModelValue(nodeModel, "info", status.message);
        }
      },
    ],
    [
      StatusType.ERROR,
      (nodeModel: NodeModel, status: Status): void => {
        if (status.type == StatusType.ERROR) {
          this.setNodeModelValue(nodeModel, "error", status.message);
        }
      },
    ],
    [
      StatusType.PROGRESS,
      (nodeModel: NodeModel, status: Status): void => {
        if (status.type == StatusType.PROGRESS) {
          this.setNodeModelValue(nodeModel, "progress", status.progress);
        }
      },
    ],
  ]);

  handleStatusEvent = (nodeModel: NodeModel, event: Status): void => {
    const typeName: StatusType = event.type;
    const statusHandler = this.statusEventHandlers.get(typeName);
    if (statusHandler !== undefined) {
      statusHandler(nodeModel, event);
    } else {
      console.warn(`Could not find any status handler for '${typeName}'`);
    }
  };

  createMeasurementHandler = (meterType: MeterType): MeasurementHandler => {
    const measurementTypes: MeasurementType[] = meterType.measurementTypes;

    const funs: MeasurementHandler[] = measurementTypes.map(
      (measurementType: MeasurementType): MeasurementHandler => {
        const measurementTypeName: string = measurementType.name;

        switch (measurementType.kind) {
          case "single": {
            const value: string = measurementType.value;

            const handleSingleValueMeasurement: MeasurementHandler = (
              nodeModel: NodeModel,
              measurement: Measurement
            ): boolean => {
              if (measurement.type === measurementTypeName) {
                this.setNodeModelValue(nodeModel, value, measurement.value);
                return true;
              } else {
                return false;
              }
            };

            return handleSingleValueMeasurement;
          }

          case "multiple": {
            const values: string[] = measurementType.values;

            const handleMultipleValueMeasurement: MeasurementHandler = (
              nodeModel: NodeModel,
              measurement: Measurement
            ): boolean => {
              if (measurement.type === measurementTypeName) {
                values.forEach((value: string) => {
                  this.setNodeModelValue(
                    nodeModel,
                    value,
                    measurement.value[value]
                  );
                });
                return true;
              } else {
                return false;
              }
            };

            return handleMultipleValueMeasurement;
          }
        }
      }
    );

    return (nodeModel: NodeModel, measurement: Measurement): void => {
      const handledEvent: boolean = funs.some((handler) =>
        handler(nodeModel, measurement)
      );

      if (!handledEvent) {
        console.warn(
          `MeasurementHandler: could not find handler for event: ${JSON.stringify(
            measurement
          )}`
        );
      }
    };
  };

  overrideStatusEventHandler = (
    eventType: StatusType,
    handler: StatusHandler
  ): void => {
    this.statusEventHandlers.set(eventType, handler);
  };

  create = (
    nodeModel: NodeModel,
    meterType: MeterType
  ): NativeEventListener => {
    if (exists(meterType.statusHandlers)) {
      const customStatusHandlers: Partial<Record<StatusType, StatusHandler>> =
        meterType.statusHandlers;

      if (customStatusHandlers[StatusType.INFO]) {
        this.overrideStatusEventHandler(
          StatusType.INFO,
          customStatusHandlers[StatusType.INFO]!
        );
      }
      if (customStatusHandlers[StatusType.ERROR]) {
        this.overrideStatusEventHandler(
          StatusType.ERROR,
          customStatusHandlers[StatusType.ERROR]!
        );
      }
      if (customStatusHandlers[StatusType.PROGRESS]) {
        this.overrideStatusEventHandler(
          StatusType.PROGRESS,
          customStatusHandlers[StatusType.PROGRESS]!
        );
      }
    }

    const handleMeasurementEvent = this.createMeasurementHandler(meterType);

    return (event: NativeEvent) => {
      console.debug(`Event: ${JSON.stringify(event)}`);

      switch (event.type) {
        case EventType.MEASUREMENT:
          const measurement: Measurement = event.measurement;
          this.setNodeModelValue(nodeModel, "origin", event.origin);
          handleMeasurementEvent(nodeModel, measurement);
          break;

        case EventType.STATUS:
          const status: Status = event.status;
          this.handleStatusEvent(nodeModel, status);
          break;
      }
    };
  };

  setNodeModelValue = (nodeModel: NodeModel, key: string, value: any): void => {
    if (nodeModel.setValue !== undefined) {
      nodeModel.setValue(key, value);
    }
  };
}
