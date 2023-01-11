export interface PatientGroup {
  name: string;
  organizationalUnitName: string;
  messagingEnabled: boolean;
  links: PatientGroupLinks;
}

export interface PatientGroupLinks {
  self: string;
  organizationalUnit: string;
}

export interface PatientGroupRef {
  name: string;
  links: PatientGroupRefLinks;
}

export interface PatientGroupRefLinks {
  patientGroup: string;
}
