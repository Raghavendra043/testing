import { Type } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Representation, NodeMap, QuestionnaireNode } from './parser.type';
import { QuestionnaireScope } from './model.type';

export enum AutomaticNodeTypeName {
  ACTIVITY_DEVICE_NODE = 'ActivityDeviceNode',
  BLOOD_PRESSURE_DEVICE_NODE = 'BloodPressureDeviceNode',
  BLOOD_SUGAR_DEVICE_NODE = 'BloodSugarDeviceNode',
  BLOOD_SUGAR_MGDL_DEVICE_NODE = 'BloodSugarMGDLDeviceNode',
  ECG_DEVICE_NODE = 'EcgDeviceNode',
  OXYGEN_FLOW_DEVICE_NODE = 'OxygenFlowDeviceNode',
  PULSE_DEVICE_NODE = 'PulseDeviceNode',
  SATURATION_DEVICE_NODE = 'SaturationDeviceNode',
  SATURATION_WITHOUT_PULSE_DEVICE_NODE = 'SaturationWithoutPulseDeviceNode',
  SPIROMETER_DEVICE_NODE = 'SpirometerDeviceNode',
  TEMPERATURE_DEVICE_NODE = 'TemperatureDeviceNode',
  TEMPERATURE_FAHRENHEIT_DEVICE_NODE = 'TemperatureFahrenheitDeviceNode',
  WEIGHT_DEVICE_NODE = 'WeightDeviceNode',
  WEIGHT_POUND_DEVICE_NODE = 'WeightPoundDeviceNode',
  FEMOM_DEVICE_NODE = 'FeMomDeviceNode',
  RESPIRATORY_RATE_DEVICE_NODE = 'RespiratoryRateDeviceNode',
}

export enum ManualNodeTypeName {
  ACTIVITY_MANUAL_DEVICE_NODE = 'ActivityManualDeviceNode',
  BLOOD_PRESSURE_MANUAL_DEVICE_NODE = 'BloodPressureManualDeviceNode',
  BLOOD_SUGAR_MANUAL_DEVICE_NODE = 'BloodSugarManualDeviceNode',
  BLOOD_SUGAR_MGDL_MANUAL_DEVICE_NODE = 'BloodSugarMGDLManualDeviceNode',
  BODY_CELL_MASS_MANUAL_DEVICE_NODE = 'BodyCellMassManualDeviceNode',
  CRP_MANUAL_DEVICE_NODE = 'CRPManualDeviceNode',
  FAT_MASS_MANUAL_DEVICE_NODE = 'FatMassManualDeviceNode',
  HEIGHT_MANUAL_DEVICE_NODE = 'HeightManualDeviceNode',
  HEMOGLOBIN_MANUAL_DEVICE_NODE = 'HemoglobinManualDeviceNode',
  OXYGEN_FLOW_MANUAL_DEVICE_NODE = 'OxygenFlowManualDeviceNode',
  PAIN_SCALE_MANUAL_DEVICE_NODE = 'PainScaleManualDeviceNode',
  PEAK_FLOW_MANUAL_DEVICE_NODE = 'PeakFlowManualDeviceNode',
  PHASE_ANGLE_MANUAL_DEVICE_NODE = 'PhaseAngleManualDeviceNode',
  PULSE_MANUAL_DEVICE_NODE = 'PulseManualDeviceNode',
  RESPIRATORY_RATE_MANUAL_DEVICE_NODE = 'RespiratoryRateManualDeviceNode',
  SATURATION_MANUAL_DEVICE_NODE = 'SaturationManualDeviceNode',
  SATURATION_WITHOUT_PULSE_MANUAL_DEVICE_NODE = 'SaturationWithoutPulseManualDeviceNode',
  SIT_TO_STAND_MANUAL_DEVICE_NODE = 'SitToStandManualDeviceNode',
  SPIROMETER_MANUAL_DEVICE_NODE = 'SpirometerManualDeviceNode',
  TEMPERATURE_MANUAL_DEVICE_NODE = 'TemperatureManualDeviceNode',
  TEMPERATURE_FAHRENHEIT_MANUAL_DEVICE_NODE = 'TemperatureFahrenheitManualDeviceNode',
  WEIGHT_MANUAL_DEVICE_NODE = 'WeightManualDeviceNode',
  WEIGHT_POUND_MANUAL_DEVICE_NODE = 'WeightPoundManualDeviceNode',
}

export enum EnumNodeTypeName {
  URINE_MANUAL_DEVICE_NODE = 'UrineManualDeviceNode',
  GLUCOSE_URINE_MANUAL_DEVICE_NODE = 'GlucoseUrineManualDeviceNode',
  BLOOD_URINE_MANUAL_DEVICE_NODE = 'BloodUrineManualDeviceNode',
  LEUKOCYTES_URINE_MANUAL_DEVICE_NODE = 'LeukocytesUrineManualDeviceNode',
  NITRITE_URINE_MANUAL_DEVICE_NODE = 'NitriteUrineManualDeviceNode',
}

export enum MultipleChoiceNodeTypeName {
  MULTIPLE_CHOICE_NODE = 'MultipleChoiceNode',
  MULTIPLE_CHOICE_QUESTION_NODE = 'MultipleChoiceQuestionNode',
  MULTIPLE_CHOICE_SUMMATION_NODE = 'MultipleChoiceSummationNode',
}

export enum MiscNodeTypeName {
  DELAY_NODE = 'DelayNode',
  IO_NODE = 'IONode',
  ASSIGNMENT_NODE = 'AssignmentNode',
  DECISION_NODE = 'DecisionNode',
  END_NODE = 'EndNode',
  UNSUPPORTED_NODE = 'UNSUPPORTED_NODE',
}

export const NodeTypeName = {
  ...AutomaticNodeTypeName,
  ...ManualNodeTypeName,
  ...EnumNodeTypeName,
  ...MultipleChoiceNodeTypeName,
  ...MiscNodeTypeName,
};

export type NodeTypeName =
  | AutomaticNodeTypeName
  | ManualNodeTypeName
  | EnumNodeTypeName
  | MultipleChoiceNodeTypeName
  | MiscNodeTypeName;

export enum NodeType {
  AUTOMATIC = 'Automatic',
  MANUAL = 'Manual',
  UNKNOWN = 'Unknown',
}

export class NodeItem {
  constructor(
    public component: Type<any>, // an instance of a Component
    public node: QuestionnaireNode,
    public nodeMap: NodeMap,
    public scope: QuestionnaireScope,
    public parameters: ComponentParameters
  ) {}
}

export interface NodeComponent {
  node: QuestionnaireNode; // Input from parent
  nodeMap: NodeMap; // Input from parent
  scope: QuestionnaireScope; // Input from parent
  nodeForm?: FormGroup; // Reactive form
  parameters: ComponentParameters;
  getRepresentation(): Representation;
}

export type ComponentParameters = Record<string, string>; // Used for `meterTypeName` to `AutomaticDeviceNodeComponent` and `measurementTypeName` to `ManualDeviceNodeComponent`
