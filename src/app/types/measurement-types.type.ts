import { Severity } from "./questionnaire-results.type";

export interface MeasurementTypesResult {
  measurements: MeasurementType[];
  links: {
    self: string;
    patient: string;
  };
}

export interface MeasurementType {
  name: MeasurementTypeName;
  links: {
    measurements: string;
  };
}

export interface MeasurementRef {
  name: string;
  icon: string;
  link: string;
}

export interface MeasurementsResult {
  type?: MeasurementTypeName;
  unit?: string;
  measurements: Measurement[];
}

export interface Measurement {
  type: MeasurementTypeName;
  timestamp: string;
  comment?: string;
  severity?: Severity;
  measurement: MeasurementValue;
}

export interface MeasurementValue {
  unit: string;
  value: number;
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  fev1: { value: number; severity: Severity | undefined };
  fev6: { value: number; severity: Severity | undefined };
  "fev6%": { value: number; severity: Severity | undefined };
  "fev1/fev6": { value: number; severity: Severity | undefined };
  "fef25-75%": { value: number; severity: Severity | undefined };
  isFasting?: boolean;
  isAfterMeal?: boolean;
  isBeforeMeal?: boolean;
}

export enum MeasurementTypeName {
  BLOOD_PRESSURE = "blood_pressure",
  BLOOD_SUGAR = "bloodsugar",
  BLOOD_SUGAR_MG_DL = "bloodsugar_mg_dl",
  BODY_CELL_MASS = "body_cell_mass",
  CRP = "crp",
  DAILY_STEPS = "daily_steps",
  DAILY_STEPS_WEEKLY_AVERAGE = "daily_steps_weekly_average",
  DURATION = "duration",
  DURATION_HOURS = "duration_hours",
  FAT_MASS = "fat_mass",
  FEF25_75 = "fef25-75%",
  FEV1 = "fev1",
  FEV1_FEV6_RATIO = "fev1/fev6",
  FEV1_PERCENTAGE = "fev1%",
  FEV6 = "fev6",
  FEV6_PERCENTAGE = "fev6%",
  GLUCOSE_IN_URINE = "glucose_in_urine",
  HEIGHT = "height",
  HEMOGLOBIN = "hemoglobin",
  OXYGEN_FLOW = "oxygen_flow",
  PAIN_SCALE = "pain_scale",
  PEAK_FLOW = "peak_flow",
  PHASE_ANGLE = "phase_angle",
  PROTEIN_IN_URINE = "protein_in_urine",
  PULSE = "pulse",
  RESPIRATORY_RATE = "respiratory_rate",
  SATURATION = "saturation",
  SIT_TO_STAND = "sit_to_stand",
  SPIROMETRY = "spirometry",
  TEMPERATURE = "temperature",
  TEMPERATURE_FAHRENHEIT = "temperature_fahrenheit",
  URINE_BLOOD = "blood_in_urine",
  URINE_LEUKOCYTES = "leukocytes_in_urine",
  URINE_NITRITE = "nitrite_in_urine",
  WEIGHT = "weight",
  WEIGHT_POUND = "weight_pound",
}
