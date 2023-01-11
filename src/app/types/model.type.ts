import { FormGroup } from '@angular/forms';
import { Filter, FilterType } from '@app/types/filter.type';
import { LoadingState } from '@app/types/loading.type';
import {
  MeasurementRef,
  MeasurementsResult,
} from '@app/types/measurement-types.type';
import { Department } from '@app/types/messages.type';
import { NodeMap, OutputModel, Representation } from '@app/types/parser.type';
import {
  QuestionnaireResultRef,
  Severity,
} from '@app/types/questionnaire-results.type';
import { ChartConfiguration } from 'chart.js';

export interface LoginModel {
  showPopup: boolean;
  showLoginForm: boolean;
  username: string;
  password: string;
  rememberMe: boolean;
  error: string | undefined;
}

export interface MenuModel {
  canChangePassword: boolean;
  menuItems: MenuItem[];
}

export interface MenuItem {
  important: boolean;
  icon: string;
  url: string;
  name: string;
}

export interface MessagesModel {
  departments: Department[];
  state: LoadingState;
  unreadMessages?: any;
}

export interface CategoryLinksModel {
  name: string;
  resources: object[];
}

export interface QuestionnaireResultsModel {
  questionnaireResults: QuestionnaireResultRef[];
  pagination: Pagination | undefined;
  state: LoadingState;
}

export interface Pagination {
  previous?: string;
  self: string;
  next?: string;
}

export interface ChangePasswordModel {
  password?: string;
  passwordRepeat?: string;
  currentPassword?: string;
  error?: string;
  showProgress: boolean;
  forceChange?: boolean;
}

export interface PinCodeLoginModel {
  state: LoadingState;
  pinCode?: string;
  pinCodeRepeat?: string;
  error?: string;
  info?: string;
}

export interface SetPinCodeModel {
  state: LoadingState;
  pinCode: string | undefined;
  pinCodeRepeat: string | undefined;
  error: string;
  info: string;
}

export interface MyMeasurementsModel {
  measurementRefs: MeasurementRef[];
  state: LoadingState;
}

export interface MeasurementModel {
  state: LoadingState;
  measurementRef: MeasurementRef;

  measurementsResult: MeasurementsResult;
  hasNoMeasurements: boolean;
  hasOtherMeasurements: boolean;

  filters: Filter[];
  filter: FilterType;
  popupMeasurement?: SingleValueTableDatum | MultiValueTableDatum;

  graph: undefined | ChartConfiguration;
  graphStandardDay: undefined | ChartConfiguration;
  table: undefined | Table;
  tableStandardDay: undefined | StandardDayTable;
}

export interface StandardDayTable {
  measurementDates: MeasurementDate[];
}

export interface MeasurementDate {
  date: string;
  night: BloodSugarTableDatum[];
  morning: BloodSugarTableDatum[];
  afternoon: BloodSugarTableDatum[];
  evening: BloodSugarTableDatum[];
}

export interface BloodSugarTableDatum extends SingleValueTableDatum {
  constraint: BloodSugarConstraint;
}

export enum BloodSugarConstraint {
  IS_BEFORE_MEAL,
  IS_AFTER_MEAL,
  IS_FASTING,
  NONE,
}

export type Table = SingleColumnTable | MultiColumnTable;

export interface SingleColumnTable {
  readonly kind: 'singleColumn';
  options: SingleColumnTableOptions;
  data: SingleValueTableDatum[];
}

export interface SingleColumnTableOptions {
  dateFormat: string;
  numberFormat: string | undefined;
  unit: string;
}

export interface SingleValueTableDatum {
  readonly kind: 'singleValue';
  timestamp: string;
  value: number | string;
  comment: string | undefined;
  severity: Severity | undefined;
  constraint: BloodSugarConstraint | undefined;
}

export interface MultiColumnTable {
  readonly kind: 'multiColumn';
  options: MultiColumnTableOptions;
  data: MultiValueTableDatum[];
}

export interface MultiColumnTableOptions {
  dateFormat: string;
  numberFormats: string[];
  units: string[];
}

export interface MultiValueTableDatum {
  readonly kind: 'multiValue';
  timestamp: string;
  values: ValueSeverityPair[];
  comment: string | undefined;
}

export interface ValueSeverityPair {
  value: number;
  severity: Severity | undefined;
}

// Questionnaire scope
export interface QuestionnaireScope {
  outputModel: OutputModel;
  nodeMap: NodeMap;
  model: QuestionnaireModel;
  representation: Representation;
  nextNode(nextNode: string, nodeMap: NodeMap): void;
  hasOffendingValue(valueName: string): boolean;
  // Forms, these could have their names aligned
  nodeForm: FormGroup | undefined;
}

export type QuestionnaireModel = {
  title: string;
  state: LoadingState;
  error: string | undefined;
  submitNodeForm: () => void;
  commentPrompt: {
    visible: boolean;
    text?: string;
    confirm: () => void;
  };
  showHelpMenuIcon: boolean;
  showHideHelpMenu: () => void;
  helpMenu?: any;
  nodeForm?: any;

  confirmTimeout?: boolean;
} & Buttons;

type Buttons = {
  leftButton: Button;
  centerButton: Button;
  rightButton: Button;
};

export interface Button {
  show: boolean;
  text: string;
  nextNodeId?: string;
  validate?(scope: QuestionnaireScope): boolean;
  click?(scope: QuestionnaireScope): void;
}
