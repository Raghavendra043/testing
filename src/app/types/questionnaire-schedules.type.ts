export interface QuestionnaireScheduleResults {
  startDate: string | null;
  onlyShowOnAnsweringDay: boolean;
  questionnaireSchedules: QuestionnaireSchedule[];
}

export type ScheduleType =
  | 'UNSCHEDULED'
  | 'WEEKDAYS'
  | 'WEEKDAYS_ONCE'
  | 'MONTHLY'
  | 'EVERY_NTH_DAY'
  | 'SPECIFIC_DATE';

export type AssignedVia =
  | 'monitoring_plan'
  | 'patient_group'
  | 'questionnaire_group';

export type PublicationStatus =
  | 'published'
  | 'draft'
  | 'published_and_draft'
  | 'none';

export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface QuestionnaireSchedule {
  questionnaireName: string;
  type: ScheduleType;
  assignedVia?: AssignedVia;
  publicationStatus?: PublicationStatus;
  links: {
    questionnaire: string;
    questionnaireDefinition: string;
    questionnaireSchedule: string;
  };
  scheduledTime?: {
    reminderStartMinutes: number;
    timesOfDay: string;
    weekdays: Weekday[];
  };
  scheduleWindowMinutes?: number;
  insideScheduleWindow?: boolean;
  nextDeadline?: string;
}

export interface QuestionnaireScheduleSummary {
  name: string;
  questionnaireId: number;
  reminderStartMinutes?: number;
  scheduleWindowStart?: Date;
  nextDeadline?: Date;
}
