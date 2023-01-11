import { fakeAsync, tick } from '@angular/core/testing';
import { Utils } from '../util-services/util.service';
import { PatientService } from './patient.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('PatientService', () => {
  let service: PatientService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let utils: Utils;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    utils = new Utils();
    service = new PatientService(utils, httpClientSpy);
  });

  const baseUrl = 'http://localhost:7000';
  const patientUrl = `${baseUrl}/clinician/api/patients/me`;

  const validRoot = {
    apiVersion: '2.58.0',
    serverEnvironment: 'development',
    links: {
      self: `${baseUrl}/clinician/api`,
      auth: `${baseUrl}/idp2/users/auth`,
      oidcAuth: '/oidc-auth',
      patient: `${baseUrl}/clinician/api/patients/me`,
      patients: `${baseUrl}/clinician/api/patients`,
      clinician: `${baseUrl}/clinician/api/clinician`,
      clinicians: `${baseUrl}/clinician/api/clinicians`,
      patientGroups: `${baseUrl}/clinician/api/patientgroups`,
      messageTemplates: `${baseUrl}/clinician/api/message_templates`,
      measurements: `${baseUrl}/clinician/api/measurements`,
      patientNotes: `${baseUrl}/clinician/api/patient-notes`,
      apiDoc: `${baseUrl}/clinician/api/provider-api.html`,
      schemas: `${baseUrl}/clinician/api/schemas`,
    },
  };

  const validResponse: any = {
    uniqueId: '2512484920',
    firstName: 'Nancy Ann',
    lastName: 'Berggren',
    dateOfBirth: null,
    sex: 'female',
    status: 'active',
    address: 'Aabogade 15',
    postalCode: '8200',
    city: 'Aarhus N',
    place: null,
    phone: null,
    mobilePhone: null,
    email: null,
    comment: null,
    username: 'NancyAnn',
    patientGroups: [
      {
        name: 'Hjertepatient',
        links: {
          patientGroup: `${baseUrl}/clinician/api/patientgroups/3`,
        },
      },
    ],
    relatives: [
      {
        firstName: 'John',
        lastName: 'Foe',
        relation: 'Spouse',
        phone: '44445555',
        address: 'Aabogade 15',
        city: 'Aarhus N',
        note: 'Call or send text',
      },
    ],
    links: {
      self: patientUrl,
      questionnaireSchedules: `${baseUrl}/clinician/api/patients/36/questionnaire_schedules`,
      measurements: `${baseUrl}/clinician/api/patients/36/measurement-types`,
      questionnaireResults: `${baseUrl}/clinician/api/patients/36/questionnaire-results`,
      questionnaires: `${baseUrl}/clinician/api/patients/36/questionnaires`,
      changePassword: `${baseUrl}/idp2/users/auth`,
      notifications: `${baseUrl}/notifications/devices`,
      thresholds: `${baseUrl}/thresholds/thresholds?patient=${baseUrl}/clinician/api/patients/36`,
    },
  };

  it('should invoke the error callback when response is an error', fakeAsync(() => {
    let errorCallbackInvoked = false;
    const root = {
      links: {
        patient: patientUrl,
        auth: '/auth',
        oidcAuth: '/oidc-auth',
      },
    };
    // @ts-ignore
    httpClientSpy.get.and.callFake((url: any) => {
      if (url === patientUrl) {
        return throwError({ status: 401, data: {} });
      } else {
        return of({ status: 200, data: {} });
      }
    });
    //@ts-ignore
    service.currentPatient(root).then(
      () => (errorCallbackInvoked = false),
      () => (errorCallbackInvoked = true)
    );
    tick();

    expect(errorCallbackInvoked).toEqual(true);
  }));

  it('should invoke the success callback when response is valid', fakeAsync(() => {
    // @ts-ignore
    httpClientSpy.get.and.callFake((url: any) => {
      if (url === patientUrl) {
        return of(validResponse);
      } else {
        return throwError({ status: 400, data: {} });
      }
    });

    let successCallbackInvoked = false;

    service.currentPatient(validRoot).then(() => {
      successCallbackInvoked = true;
    });
    tick();

    expect(successCallbackInvoked).toEqual(true);
  }));

  it('should transform response to client object', fakeAsync(() => {
    // @ts-ignore
    httpClientSpy.get.and.callFake((url: any) => {
      if (url === patientUrl) {
        return of(validResponse);
      } else {
        return throwError({ status: 400, data: {} });
      }
    });

    let patientData: any;
    service.currentPatient(validRoot).then((data: any) => {
      patientData = data;
    });

    tick();

    expect(patientData.firstName).toEqual('Nancy Ann');
    expect(patientData.lastName).toEqual('Berggren');
    expect(patientData.username).toEqual('NancyAnn');
    expect(patientData.links.self).toEqual(patientUrl);
  }));
});
