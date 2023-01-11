import { NativeEvent, MeasurementEvent } from './listener.type';
import { QuestionnaireScheduleSummary } from './questionnaire-schedules.type';

export type Callback = Function;

export interface Handler {
  autoUnregister: boolean;
  handleMessage: Function;
}

export type Message =
  | ClearScheduledQuestionnaireRequestMessage
  | UpdateScheduledQuestionnairesRequestMessage
  | DeviceTokenRequestMessage
  | DeviceTokenResponseMessage
  | DeviceMeasurementRequestMessage
  | DeviceMeasurementResponseMessage
  | VideoEnabledResponseMessage
  | VideoConferenceResponseMessage
  | LogEntriesReadyMessage;

export interface ClearScheduledQuestionnaireRequestMessage {
  messageType: 'clearScheduledQuestionnaireRequest';
  questionnaireId: number;
}

export interface UpdateScheduledQuestionnairesRequestMessage {
  messageType: 'updateScheduledQuestionnairesRequest';
  scheduledQuestionnaires: QuestionnaireScheduleSummary[];
}

export interface DeviceTokenRequestMessage {
  messageType: 'deviceTokenRequest';
}

export interface DeviceTokenResponseMessage {
  messageType: 'deviceTokenResponse';
  deviceToken: string;
}

export interface DeviceMeasurementRequestMessage {
  messageType: 'deviceMeasurementRequest';
  meterType: string;
  parameters: object;
}

export interface DeviceMeasurementResponseMessage {
  messageType: 'deviceMeasurementResponse';
  meterType: string;
  event: MeasurementEvent;
}

export interface VideoEnabledResponseMessage {
  messageType: 'videoEnabledResponse';
  enabled: boolean;
}

export interface VideoConferenceResponseMessage {
  messageType: 'videoConferenceResponse';
  event: NativeEvent;
}

export interface LogEntriesReadyMessage {
  messageType: 'logMessagesReady';
  entries: LogEntry[];
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'debug',
  WARN = 'debug',
  ERROR = 'error',
}
