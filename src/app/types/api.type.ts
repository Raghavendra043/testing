import { WithLinks } from "@app/types/utility.type";
import { PatientRef } from "./calendar-event.type";
import { CreatePatientForm, sex } from "./form.type";
import { Links, PatientGroupLink } from "./user.type";

export type ApiRoot = WithLinks<"patient" | "auth" | "oidcAuth" | "clinician">;

export interface RestResponse {
  results: object[];
  total: number;
  max: number;
  offset: number;
  links: {
    self: string;
  };
}

export interface PatientGetResponse extends RestResponse {
  results: PatientRef[];
}

export interface PatientCreateResponse {
  uniqueId: string;
  firstName: string;
  lastName: string;
  sex: sex;
  username: string;
  temporaryPassword: string;
  address: string;
  postalCode: string;
  city: string;
  phone?: string;
  email?: string;
  dateOfBirth: string;
  patientGroups: PatientGroupLink[];
  links: Links;
}
