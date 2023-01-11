import { Injectable } from '@angular/core';

Injectable();
export class FakePatientService {
  currentPatient(_root: any) {
    const patient = {
      firstName: 'Nancy Ann',
      lastName: 'Doe',
      username: 'nancyann',
      links: {
        self: 'http://localhost/patient',
        logEntries: 'http://localhost/logging/entries/some-audit-id',
      },
    };
    return Promise.resolve(patient);
  }
}
