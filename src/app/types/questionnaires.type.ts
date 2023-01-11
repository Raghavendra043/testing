import { Links, WithLinks } from './utility.type';
import { OutputVariable, QuestionnaireNode } from './parser.type';

export interface Questionnaires {
  results: QuestionnaireRef[];
  links: Links<'self' | 'patient'>;
}

export interface Questionnaire {
  name: string;
  version: string;
  startNode: string;
  endNode: string;
  nodes: Record<string, QuestionnaireNode>[];
  output: OutputVariable[];
  links: Links<'self' | 'questionnaireResult'>;
}

export type QuestionnaireRef = Pick<Questionnaire, 'name' | 'version'> &
  WithLinks<'questionnaire'> & { scheduleWindow: any };
