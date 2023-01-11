import { Injectable } from '@angular/core';

Injectable();
export class FakeMeasurementsService {
  baseUrl = 'http://localhost:7000/clinician/api/patients/me';
  restServiceResult = {
    measurements: [
      {
        name: 'blood_pressure',
        links: {
          measurement: `${this.baseUrl}/measurements?type=blood_pressure`,
        },
      },
      {
        name: 'pulse',
        links: {
          measurement: `${this.baseUrl}/measurements?type=pulse`,
        },
      },
      {
        name: 'weight',
        links: {
          measurement: `${this.baseUrl}/measurements?type=weight`,
        },
      },
      {
        name: 'bloodsugar',
        links: {
          measurement: `${this.baseUrl}/measurements?type=bloodsugar`,
        },
      },
    ],
  };

  listTypes = (user: any) => {
    return Promise.resolve(this.restServiceResult);
  };
}
