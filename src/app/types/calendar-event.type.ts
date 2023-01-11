import { PatientGroupRef } from "./patient-group.type";
import { Relative } from "./relative.type";

export interface CalendarResult {
  total: number;
  offset: number;
  max: number;
  results: CalendarEvent[];
  links: {
    self: string;
    next: string;
    previous: string;
  };
}

export interface CalendarEvent {
  type: SessionType;
  description: string;
  schedule: Schedule;
  party: Party;
  links: {
    self: string;
    event: string;
    origin: string;
  };
}

export const enum SessionType {
  IndividualSession = "individual_session",
}

export interface Schedule {
  startTime: string;
  endTime?: string;
}

export interface Party {
  clinicians: Clinician[];
  patients: Patient[];
}

interface Contact {
  firstName: string;
  lastName: string;
  username: string;
}

export interface Clinician extends Contact {
  email: string;
  links: {
    clinician: string;
    patients: string;
  };
}

export interface Patient extends Contact {
  uniqueId: string;
  sex: string;
  status: string;
  dateOfBirth: string;
  address: string;
  postalCode: string;
  city: string;
  place: string;
  phone: string;
  mobilePhone: string;
  email: string;
  comment: string;
  username: string;
  patientGroups: PatientGroupRef[];
  relatives: Relative[];
  thresholds: any;
  links: PatientLinks;
}
export interface PatientLinks {
  self: string;
}

export interface PatientRef {
  createdDate: string;
  uniqueId: string;
  username: string;
  firstName: string;
  lastName: string;
  status: string;
  links: {
    patient: string;
    metadata?: string;
  };
}
