export interface QuestionnaireResultRef {
  name: string;
  severity?: Severity;
  acknowledged: boolean;
  resultDate: string;
  links: {
    patient: string;
    questionnaire: string;
    questionnaireResult: string;
  };
}

export interface QuestionnaireResults {
  results: QuestionnaireResultRef[];
  total: number;
  max: number;
  offset: number;
  links: {
    self: string;
    next?: string;
    previous?: string;
  };
}

export interface QuestionnaireResult {
  name: string;
  severity: Severity;
  acknowledgement: any;
  resultDate: string;
  questions: Question[];
  links: {
    patient: string;
    questionnaire: string;
    self: string;
  };
}

export interface Question {
  severity?: Severity;
  text: string;
  patientText: string;
  reply: Reply;
}

export type Reply = InputReply | OmittedReply | MeasurementsReply;

export interface InputReply {
  patientAnswer?: string;
  answer: string | boolean | number;
}

export interface OmittedReply {
  omitted: true;
}

export interface MeasurementsReply {
  measurements: Measurement[];
}

export interface Measurement {
  timestamp: string;
  type: string; // technically an enum
  measurement: MeasurementValue;
  severity: Severity;
  comment?: string;
  origin: any;
  links: {
    measurement: string;
    patient: string;
  };
}

export type MeasurementValue =
  | BloodPressureValue
  | BloodSugarValue
  | SimpleValue;

export interface BloodPressureValue {
  unit: string;
  systolic: number;
  diastolic: number;
}

export interface BloodSugarValue {
  unit: string;
  isAfterMeal: boolean;
  isBeforeMeal: boolean;
  isFasting: boolean;
  value: number;
}

export interface SimpleValue {
  unit: string;
  value: number | string;
}

export type Severity = 'green' | 'yellow' | 'orange' | 'red';
