import { PatientGroupLink } from './user.type';

export interface CreatePatientForm {
  uniqueId: string;
  firstName: string;
  lastName: string;
  sex: sexListItem | string;
  username: string;
  temporaryPassword: string;
  address: string;
  postalCode: string;
  city: string;
  phone?: string;
  email?: string;
  dateOfBirth: string;
  patientGroups?: { name: string; link: string }[];
  links: {
    patientGroups: string[];
  };
}

export interface sexListItem {
  name: string;
  value: sex;
}
export type sex = 'unknown' | 'male' | 'female';
