import { PatientGroupRef } from "./patient-group.type";


export interface Clinician {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    patientGroups: PatientGroupRef[];
    links: ClinicianLinks;
}

export interface ClinicianLinks {
    self: string;
    patients: string;
    questionnaires: string;
    logout?: string;
}
