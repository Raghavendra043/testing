import { Organization } from "./organization.type";

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  claims: object;
  canChangePassword: boolean;
  organizations: Organization[];
  links: Links;
  patientGroups?: PatientGroupLink[];
}
type url = string;

export interface PatientGroupLink {
  name: string;
  links: {
    patientGroup: url;
  };
}

export interface Links {
  self: url;
  questionnaireSchedules: url;
  measurements: url;
  questionnaireResults: url;
  questionnaires: url;
  changePassword: url;
  notifications: url;
  thresholds: url;
  contactInfo: url;
  auth: url;
  logout: url;
  linksCategories?: url;
  acknowledgements?: url;
  attachments?: url;
  calendar?: url;
  individualSessions?: url;
  logEntries?: url;
  messages?: url;
  threads?: url;
}
