import { NodeModel } from "./parser.type";
import { MeterType } from "./meter.type";

// Helpers

export interface Constants {
  [Key: string]: string;
}

// Device listener

export interface DeviceListener {
  overrideStatusEventHandler(
    eventType: string,
    handler: DeviceEventHandler
  ): void;
  create(model: NodeModel, meterType: MeterType): (event: NativeEvent) => void;
}

// Native event listener

export type NativeEventListener = (event: NativeEvent) => void;

export type DeviceEventHandler = (
  nodeModel: NodeModel,
  event: NativeEvent
) => void;

export type StatusHandler = (nodeModel: NodeModel, event: Status) => void;

export type MeasurementHandler = (
  nodeModel: NodeModel,
  event: Measurement
) => void;

// Events

export enum EventType {
  STATUS = "status",
  MEASUREMENT = "measurement",
}

export type NativeEvent = StatusEvent | MeasurementEvent;

export type StatusEvent = { type: EventType.STATUS; status: Status };

export type MeasurementEvent = {
  type: EventType.MEASUREMENT;
  measurement: Measurement;
  origin: Origin;
};

export enum StatusType {
  INFO = "info",
  ERROR = "error",
  PROGRESS = "progress",
}

export type Status =
  | { type: StatusType.INFO; message: string }
  | { type: StatusType.ERROR; message: string }
  | {
      message: number;
      type: StatusType.PROGRESS;
      progress: number;
    };

export interface Measurement {
  type: MeasurementTypeName;
  unit: string;
  value: MeasurementValue;
}

// Note: there is a clash between this and the MeasurementTypeName enum defined in `measurement-types.type.ts`
export type MeasurementTypeName =
  | "activity"
  | "blood_pressure"
  | "blood_sugar"
  | "ecg"
  | "oxygen_flow"
  | "pulse"
  | "respiratory_rate"
  | "saturation"
  | "spirometry"
  | "temperature"
  | "weight";

export type MeasurementValue =
  | number
  | DailyStepsValue[]
  | BloodPressureValue
  | BloodSugarHistoricalValues
  | ECGValue;

export interface DailyStepsValue {
  result: number;
  timeOfMeasurement: string;
}

export type BloodSugarHistoricalValues = {
  measurements: BloodSugarValue[];
  transferTime: string;
};

export interface BloodSugarValue {
  result: number;
  timeOfMeasurement: string;
  isAfterMeal: boolean;
  isBeforeMeal: boolean;
  isFasting: boolean;
}

export interface BloodPressureValue {
  systolic: number;
  diastolic: number;
  meanArterialPressure?: number;
}

export interface ECGValue {
  startTime?: Date;
  duration?: UnitValue<number>;
  frequency?: UnitValue<number>;
  rrIntervals?: UnitValue<[number]>;
  samples?: ECGSamples;
}

export interface ECGSamples {
  unit: string;
  channels: ECGChannel[];
}

export interface ECGChannel {
  channel: number;
  data: [number];
}

export interface UnitValue<T> {
  unit: string;
  value: T;
}

// Origin
export interface Origin {
  manual_measurement?: ManualMeasurement;
  device_measurement?: DeviceMeasurement;
}

export interface ManualMeasurement {
  entered_by: string;
}

export interface DeviceMeasurement {
  connection_type: string;
  hardware_version?: string;
  firmware_version?: string;
  software_version?: string;
  manufacturer: string;
  model: string;
  primary_device_identifier: DeviceIdentifier;
  additional_device_identifiers?: DeviceIdentifierArray;
}

export interface DeviceIdentifierArray {
  [index: number]: DeviceIdentifier;
}

export interface DeviceIdentifier {
  mac_address?: string;
  system_id: string;
  serial_number: string;
  other: Other;
}

export interface Other {
  description: string;
  value: any;
}
