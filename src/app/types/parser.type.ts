import { NativeEventListener } from "./listener.type";
import { MeterType } from "./meter.type";
import { Button } from "./model.type";
import { NodeTypeName } from "./nodes.type";
import { Questionnaire, QuestionnaireRef } from "./questionnaires.type";

// Helper
export type Predicate = (obj: unknown) => boolean;

export type OutputModel = Record<string, OutputVariable>;

type Value = string | number | boolean | object | Value[];

export interface OutputVariable {
  name: string;
  type: string;
  value?: Value | undefined;
}

// Node model
export interface NodeModel {
  nodeId: string;
  heading?: string;
  info?: string;
  error?: string;
  eventListener?: NativeEventListener;
  progress?: number; // Shouldn't exist on NodeModel
  remaining?: number; // Shouldn't exist on NodeModel
  count?: number; // Shouldn't exist on NodeModel
  comment?: Comment; // Shouldn't exist on NodeModel
  measurement?: any; // Shouldn't exist on NodeModel
  origin?: any; // Shouldn't exist on NodeModel
  measurementSelections?: any; // Shouldn't exist on NodeModel
  setValue?(key: string, value: any): void; // Ideally shouldn't exist on NodeModel, used by device listeners to trigger applicationRef.tick
  fef2575?: number;
  fev1Fev6Ratio?: number;
  rangeCheck?(nodeModel: NodeModel): string[];
  offendingValues?: string[];
}

export type DynamicNodeModel = {
  // Hack needed due to dynamic property lookup in ioNodeParser.
  [key: string]: any;
};

export interface MultipleChoiceNodeModel extends NodeModel {
  selectedIndex?: number;
  choices: Choice[];
}

export interface MultipleChoiceQuestionNodeModel extends NodeModel {
  selectedIndex?: string;
  choices: Choice[];
}

export type MultipleChoiceSummationNodeModel = NodeModel;

export interface DelayNodeModel extends NodeModel {
  count: number;
  countTime: number;
  countUp: boolean;
  onTimerStopped(): void;
}

export interface RadioItemsNodeModel extends NodeModel {
  radioItems?: RadioItem[];
  radioSelected?: any;
}

export interface RadioItem {
  label: string;
  value: any;
}

export interface EnumNodeModel extends NodeModel {
  enumValues: string[];
}

export interface BloodSugarNodeModel extends NodeModel {
  bloodSugarManualBeforeMeal?: string;
  bloodSugarManualAfterMeal?: string;
  bloodSugarManualFasting?: string;
  bloodSugarManualMeasurement?: any;
  mealIndicator?: string;
}

export interface BloodPressureNodeModel extends NodeModel {
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  meanArterialPressure?: number;
  rangeCheck?: any;
}

export interface SaturationNodeModel extends NodeModel {
  saturation: number;
  pulse?: number;
}

export interface CRPNodeModel extends NodeModel {
  crpLt5Measurement?: boolean;
  crpCountMeasurement?: number;
}

export interface SpirometerNodeModel extends NodeModel {
  fev1: number;
  fev6: number;
  fef2575: number;
  fev1Fev6Ratio: number;
}

export interface ActivityNodeModel extends NodeModel {
  dailySteps?: number;
}

export interface PainScaleNodeModel extends NodeModel {
  painScaleMeasurement: number;
}

export interface ECGNodeModel extends NodeModel {
  sampleTime: number;
  remaining: number;
  progress: number;

  duration?: UnitValue<number>;
  frequency?: UnitValue<number>;
  rrIntervals?: UnitValue<[number]>;
  samples?: UnitValue<ECGChannel[]>;
}

export interface UnitValue<T> {
  unit: string;
  value: T;
}

export interface ECGChannel {
  channel: number;
  data: [number];
}

export type NodeMap = {
  [key: string]: NodeWrapper;
};

export type NodeWrapper = {
  [key: string]: QuestionnaireNode;
};

export interface QuestionnaireNode {
  nodeName: string;
}

export interface IONode extends QuestionnaireNode {
  next: string;
  elements: NodeElementWrapper[];
}

export interface NodeElementWrapper {
  [key: string]: NodeElementWrapper;
}

export type EndNode = QuestionnaireNode;

export interface AssignmentNode extends QuestionnaireNode {
  next: string;
  variable: NodeValueEntry;
  expression: AssignmentExpression;
}

export interface DecisionNode extends QuestionnaireNode {
  next: string;
  nextFalse: string;
  expression: DecisionExpression;
}

export interface HelpNode extends QuestionnaireNode {
  next: string;
  nextFail: string;
  text: string;
  helpText?: string;
  helpImage?: string;
  comment?: Comment;
}

export interface MeasurementNode extends QuestionnaireNode {
  next: string;
  nextFail: string;
  text: string;
  origin?: NodeValueEntry;
  helpText?: string;
  helpImage?: string;
  comment?: Comment;
  bloodSugarMeasurements?: NodeValueEntry;
  CRP?: NodeValueEntry;
}

// Hack needed due to dynamic property lookup in deviceNodeParser.
export type DynamicMeasurementNode = Record<string, any>;

export interface HemoglobinNode extends MeasurementNode {
  haemoglobinValue: NodeValueEntry;
}

export interface PainScaleNode extends MeasurementNode {
  painScale: NodeValueEntry;
}

export interface UrineNode extends MeasurementNode {
  urine: NodeValueEntry;
}

export interface GlucoseInUrineNode extends MeasurementNode {
  glucoseUrine: NodeValueEntry;
}

export interface NitriteInUrineNode extends MeasurementNode {
  nitriteUrine: NodeValueEntry;
}

export interface LeukocytesInUrineNode extends MeasurementNode {
  leukocytesUrine: NodeValueEntry;
}

export interface BloodInUrineNode extends MeasurementNode {
  bloodUrine: NodeValueEntry;
}

export interface ECGNode extends MeasurementNode {
  sampleTimeInSeconds: number;
}

export interface MultipleChoiceNode extends QuestionnaireNode {
  question: string;
  next?: string; // only exists if branchOnChoices is false
  branchOnChoices: boolean;
  answer: Answer;
}

export interface MultipleChoiceQuestionNode extends QuestionnaireNode {
  question: string;
  next: string;
  answer: Answer;
}

export interface MultipleChoiceSummationNode extends QuestionnaireNode {
  name: string;
  type: string;
  next?: string; // only exists if branchOnSum is false
  branchOnSum: boolean;
  intervals: Interval[];
  questions: string[];
}

export interface Answer {
  name: string;
  type: string;
  choices: Choice[];
}

export interface Choice {
  next: string;
  value: string;
  text?: string;
}

export interface Interval {
  from: number;
  to: number;
  next: string;
}

export interface Comment {
  name: string;
  type: string;
  text?: string;
}

export interface DelayNode extends QuestionnaireNode {
  displayTextString: string;
  countUp: boolean;
  countTime: number;
  next: string;
}

export interface NodeValueEntry {
  name: string;
  type: string;
  range?: InputRange;
}

export interface InputRange {
  min: number;
  max: number;
}

export interface AssignmentExpression {
  value: any;
}

export interface DecisionExpression {
  lt?: ComparisonExpression;
  gt?: ComparisonExpression;
  eq?: ComparisonExpression;
}

export interface ComparisonExpression {
  left: DecisionValueAndType;
  right: DecisionValueAndType;
}

export interface DecisionValueAndType {
  value: any; // string | number | boolean
  type: DecisionValueType;
}

export enum DecisionValueType {
  NAME = "name",
  INTEGER = "Integer",
  FLOAT = "Float",
  BOOLEAN = "Boolean",
}

// Node element

export interface NodeElement {}

export interface TextViewElement extends NodeElement {
  text: string;
}

export interface ButtonElement extends NodeElement {
  text: string;
  next: string;
  gravity: string;
  skipValidation: boolean;
}

export interface TwoButtonElement extends NodeElement {
  leftText: string;
  leftNext: string;
  leftSkipValidation?: boolean;
  rightText: string;
  rightNext: string;
  rightSkipValidation?: boolean;
}

export interface OriginElement extends NodeElement {
  outputVariable: NodeValueEntry;
}

export interface CommentElement extends NodeElement {
  outputVariable: NodeValueEntry;
}

export interface HelpTextElement extends NodeElement {
  text: string;
  image: string;
}

export interface EditTextElement extends NodeElement {
  outputVariable: NodeValueEntry;
}

export interface RadioButtonElement extends NodeElement {
  choices: RadioButtonChoice[];
  outputVariable: NodeValueEntry;
}

export interface RadioButtonChoice {
  text: string;
  value: RadioButtonChoiceValue;
}

export interface RadioButtonChoiceValue {
  type: string;
  value: string;
}

// Node parser
export interface DeviceNodeParserCreator {
  create(meterType: MeterType, deviceNodeType: DeviceNodeType): NodeParser<any>;
}

export type NodeParserFunction<T extends QuestionnaireNode> = (
  node: T,
  nodeMap: NodeMap,
  outputModel: OutputModel
) => Representation;

export interface NodeParser<T extends QuestionnaireNode> {
  parseNode: NodeParserFunction<T>;
}

export type NodeParserType =
  | AutomaticDeviceNodeParserType
  | ManualDeviceNodeParserType
  | EnumDeviceNodeParserType;

export interface AutomaticDeviceNodeParserType {
  nodeTypeName: NodeTypeName;
  deviceNodeType: DeviceNodeType;
  formInputs: AutomaticFormInput[];
}

export interface ManualDeviceNodeParserType {
  typeName: string;
  typeValue: string;
  translationId: string;
}

export interface EnumDeviceNodeParserType {
  typeName: string;
  values: string[];
}

export interface DeviceNodeType {
  meterType: MeterType;
  infoText?: string;
  outputMapper(measurements: string[], nodeModel: NodeModel): string[];
}

// Form input
export type FormInput = AutomaticFormInput | ManualFormInput | EnumFormInput;

export interface AutomaticFormInput {
  translationId: string;
  key: string;
}

export interface ManualFormInput {
  translationId: string;
  nodeTypeName: string;
  nodeTypeValue: any;
  formStep: string | undefined;
  formPattern: string | undefined;
}

export interface EnumFormInput {
  nodeTypeName: string;
  level: string;
}

// Representation
export enum RepresentationType {
  NODE = "node",
  SKIP = "skip",
  END = "end",
  UNSUPPORTED = "unsupported",
}

export type Representation =
  | NodeRepresentation
  | SkipRepresentation
  | EndRepresentation
  | UnsupportedRepresentation;

export interface UnsupportedRepresentation {
  kind: RepresentationType.UNSUPPORTED;
  nodeModel: NodeModel;
  leftButton?: Button;
  centerButton?: Button;
  rightButton?: Button;
}

export interface NodeRepresentation {
  kind: RepresentationType.NODE;
  nodeModel: NodeModel;
  leftButton?: Button;
  centerButton?: Button;
  rightButton?: Button;
  helpMenu?: HelpMenu;
  selectedIndex?: number;
}

export interface SkipRepresentation {
  kind: RepresentationType.SKIP;
  nodeModel: NodeModel;
  nextNodeId: string;
}

export interface EndRepresentation {
  kind: RepresentationType.END;
  nodeModel: NodeModel;
}

export interface HelpMenu {
  text: string | undefined;
  image: string | undefined;
}

export interface QuestionnaireState {
  outputs: OutputVariable[];
  questionnaire: Questionnaire;
  questionnaireRef: QuestionnaireRef;
  nodeHistory: string[];
  outputModel: OutputModel;
}
