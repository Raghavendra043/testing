import {
  MeasurementTypeName,
  Status,
  StatusHandler,
  StatusType,
} from "./listener.type";
import { ECGNodeModel, NodeModel } from "./parser.type";

export const meterTypes: MeterTypeDictionary = {
  ACTIVITY_TRACKER: {
    name: "activity tracker",
    parameters: [],
    measurementTypeName: "activity",
    measurementTypes: [
      {
        kind: "single",
        name: "dailySteps",
        unit: "step count",
        value: "dailySteps",
      },
      {
        kind: "single",
        name: "dailyStepsWeeklyAverage",
        unit: "step count",
        value: "dailyStepsWeeklyAverage",
      },
      {
        kind: "single",
        name: "dailyStepsHistoricalMeasurements",
        unit: "step count",
        value: "dailyStepsHistoricalMeasurements",
      },
    ],
    statusHandlers: {
      progress: (nodeModel: NodeModel, status: Status) => {
        if (status.type === "progress") {
          nodeModel.progress = status.progress;
        }
      },
    },
  },

  BLOOD_PRESSURE_MONITOR: {
    name: "blood pressure monitor",
    parameters: [],
    measurementTypeName: "blood_pressure",
    measurementTypes: [
      {
        kind: "multiple",
        name: "blood pressure",
        unit: "mmHg",
        values: ["systolic", "diastolic", "meanArterialPressure"],
      },

      {
        kind: "single",
        name: "pulse",
        unit: "BPM",
        value: "pulse",
      },
    ],
  },

  ECG: {
    name: "ecg",
    parameters: ["sampleTimeInSeconds"],
    measurementTypeName: "ecg",
    measurementTypes: [
      {
        kind: "multiple",
        name: "ecg",
        values: [
          "startTime",
          "duration",
          "frequency",
          "rrIntervals",
          "samples",
        ],
      },
    ],
    statusHandlers: {
      progress: (nodeModel: NodeModel, event: Status) => {
        const ecgModel = nodeModel as ECGNodeModel;

        const calculateProgressInPercent = (
          sampleTime: number,
          progress: number
        ) => (progress / sampleTime) * 100;

        const calculateSecondsRemaining = (
          sampleTime: number,
          progress: number
        ) => sampleTime - progress;

        if (event.type == StatusType.PROGRESS) {
          const progress = event.progress;
          const sampleTime = ecgModel.sampleTime;

          ecgModel.progress = calculateProgressInPercent(sampleTime, progress);
          ecgModel.remaining = calculateSecondsRemaining(sampleTime, progress);
        }
      },
    },
  },

  GLUCOMETER: {
    name: "glucometer",
    parameters: [],
    measurementTypeName: "blood_sugar",
    measurementTypes: [
      {
        kind: "single",
        name: "blood sugar",
        unit: "mmol/L",
        value: "bloodSugarMeasurements",
      },
    ],
  },

  OXIMETER: {
    name: "oximeter",
    parameters: [],
    measurementTypeName: "saturation",
    measurementTypes: [
      {
        kind: "single",
        name: "saturation",
        unit: "%",
        value: "saturation",
      },

      {
        kind: "single",
        name: "pulse",
        unit: "BPM",
        value: "pulse",
      },
    ],
  },

  OXYGEN_FLOW: {
    name: "oxygen flow",
    parameters: [],
    measurementTypeName: "oxygen_flow",
    measurementTypes: [
      {
        kind: "single",
        name: "oxygenFlow",
        unit: "L/min",
        value: "oxygenFlow",
      },
    ],
  },

  OXIMETER_WITHOUT_PULSE: {
    name: "oximeter",
    parameters: [],
    measurementTypeName: "saturation",
    measurementTypes: [
      {
        kind: "single",
        name: "saturation",
        unit: "%",
        value: "saturation",
      },
    ],
  },

  PULSE: {
    name: "pulse",
    parameters: [],
    measurementTypeName: "pulse",
    measurementTypes: [
      {
        kind: "single",
        name: "pulse",
        unit: "BPM",
        value: "pulse",
      },
    ],
  },

  RESPIRATORY_RATE: {
    name: "respiratory rate",
    parameters: [],
    measurementTypeName: "respiratory_rate",
    measurementTypes: [
      {
        kind: "single",
        name: "respiratoryRate",
        unit: "RR",
        value: "respiratoryRate",
      },
    ],
  },

  SPIROMETER: {
    name: "spirometer",
    parameters: [],
    measurementTypeName: "spirometry",
    measurementTypes: [
      {
        kind: "single",
        name: "fev1",
        unit: "L",
        value: "fev1",
      },

      {
        kind: "single",
        name: "fev6",
        unit: "L",
        value: "fev6",
      },

      {
        kind: "single",
        name: "fev1/fev6",
        unit: "%",
        value: "fev1/fev6",
      },

      {
        kind: "single",
        name: "fef25-75%",
        unit: "L/s",
        value: "fef25-75%",
      },
    ],
  },

  THERMOMETER: {
    name: "thermometer",
    parameters: [],
    measurementTypeName: "temperature",
    measurementTypes: [
      {
        kind: "single",
        name: "temperature",
        unit: "°C",
        value: "temperature",
      },
    ],
  },

  WEIGHT_SCALE: {
    name: "weight scale",
    parameters: [],
    measurementTypeName: "weight",
    measurementTypes: [
      {
        kind: "single",
        name: "weight",
        unit: "kg",
        value: "weight",
      },
    ],
  },
};

export interface MeterTypeDictionary {
  ACTIVITY_TRACKER: MeterType;
  BLOOD_PRESSURE_MONITOR: MeterType;
  ECG: MeterType;
  GLUCOMETER: MeterType;
  OXIMETER: MeterType;
  OXIMETER_WITHOUT_PULSE: MeterType;
  PULSE: MeterType;
  RESPIRATORY_RATE: MeterType;
  SPIROMETER: MeterType;
  THERMOMETER: MeterType;
  WEIGHT_SCALE: MeterType;
  OXYGEN_FLOW: MeterType;
}

export interface MeterType {
  name: string;
  parameters: MeterParameter[];
  measurementTypes: MeasurementType[];
  measurementTypeName: MeasurementTypeName;
  statusHandlers?: Partial<Record<StatusType, StatusHandler>>;
}

export type MeterParameter = "sampleTimeInSeconds";

export type MeasurementType = SingleMeasurementType | MultipleMeasurementType;

interface MeasurementTypeBase {
  kind: string;
  name: string;
  unit?: string;
}

export interface SingleMeasurementType extends MeasurementTypeBase {
  kind: "single";
  value: string;
}

export interface MultipleMeasurementType extends MeasurementTypeBase {
  kind: "multiple";
  values: string[];
}

export type MeterParameters = {
  [key: string]: string | number;
};
