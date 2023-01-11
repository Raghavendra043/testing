import { Injectable } from '@angular/core';
import { User } from '@app/types/user.type';

Injectable();
export class FakeStatePassingService {
  params = {};
  appConfig = {};

  requestParams: any = {
    containsKey: (key: any) => {
      return true;
    },
    getAndClear(key: any) {
      switch (key) {
        case 'selectedCategory': {
          return selectedCategory;
        }
        default: {
          return {};
        }
      }
    },
    get: (key: any) => {
      switch (key) {
        case 'exception': {
          return exception;
        }
        default: {
          return {};
        }
      }
    },
  };

  currentUser = {
    get() {
      return {};
    },
    set() {
      return;
    },
    clear() {
      return;
    },
    isValid() {
      return true;
    },
  };

  getUser() {
    const selectedPatient: any = this.requestParams.get('selectedPatient');
    return selectedPatient ? selectedPatient : this.currentUser.get()!;
  }
}

export const selectedCategory = {
  name: 'Information',
  resources: [
    {
      title: 'OpenTele user manual',
      url: 'http://www.opentelehealth.com/devices/',
    },
    {
      title: 'Saturation measurement guide',
      url: 'http://www.opentelehealth.com/architecture/',
    },
  ],
  patientGroups: ['http://localhost/clinician/api/patientgroups/1'],
  links: {
    self: 'http://localhost/guidance/categories/1',
  },
};

export const exception = {
  stack: 'STACK TRACE!',
  message: 'An error occurred!',
};

export const mockUser: User = {
  firstName: 'first name',
  lastName: 'last name',
  username: 'Username',
  claims: {},
  canChangePassword: true,
  organizations: [
    {
      name: 'Department of Health',
      url: 'http://localhost/organizations/9',
    },
  ],
  links: {
    thresholds: '/thresholds',
    contactInfo: '/contact-info',
    logout: 'http://localhost.oth.io/idp2/tokens/60890',
    auth: 'http://localhost.oth.io/idp2/users/auth',
    linksCategories:
      'http://localhost.oth.io/guidance/categories?patientGroups[]=http://localhost.oth.io/clinician/api/patientgroups/384&patientGroups[]=http://localhost.oth.io/clinician/api/patientgroups/3&max=100',
    individualSessions: 'http://localhost.oth.io/meetings/individual-sessions',
    calendar: 'http://localhost.oth.io/calendar/events',
    acknowledgements:
      'http://localhost.oth.io/clinician/api/patients/13/acknowledgements',
    attachments: 'http://localhost.oth.io/chat/attachments',
    messages: 'http://localhost.oth.io/chat/messages',
    threads: 'http://localhost.oth.io/chat/threads',
    notifications: 'http://localhost.oth.io/notifications/devices',
    changePassword: 'http://localhost.oth.io/idp2/users/auth',
    questionnaires:
      'http://localhost.oth.io/clinician/api/patients/13/questionnaires',
    questionnaireResults:
      'http://localhost.oth.io/clinician/api/patients/13/questionnaire-results',
    measurements:
      'http://localhost.oth.io/clinician/api/patients/13/measurement-types',
    questionnaireSchedules:
      'http://localhost.oth.io/clinician/api/patients/13/questionnaire_schedules',
    self: 'http://localhost.oth.io/clinician/api/patients/13',
  },
};
