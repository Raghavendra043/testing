import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { User } from '../types/user.type';

Injectable();
export class FakeMessageThreadService2 {
  restServiceResult = {
    results: [
      {
        unreadFromOrganization: 2,
        unreadFromPatient: 0,
        organizationName: 'Obstetrisk Y, AUH, RM',
        latestMessageAt: '2021-12-07T00:01:00Z',
        links: {
          thread: 'http://localhost/threads/6',
          messages: 'http://localhost/threads/6/messages',
          organization: 'http://localhost/organizations/6',
          patient: 'http://localhost/patient/1',
        },
      },
      {
        unreadFromOrganization: 2,
        unreadFromPatient: 0,
        organizationName: 'TCN',
        latestMessageAt: '2021-12-07T00:01:00Z',
        links: {
          thread: 'http://localhost/threads/8',
          messages: 'http://localhost/threads/8/messages',
          organization: 'http://localhost/organizations/8',
          patient: 'http://localhost/patient/1',
        },
      },
      {
        unreadFromOrganization: 2,
        unreadFromPatient: 0,
        organizationName: 'Afdeling-B Test',
        latestMessageAt: '2021-12-07T00:01:00Z',
        links: {
          thread: 'http://localhost/threads/1',
          messages: 'http://localhost/threads/1/messages',
          organization: 'http://localhost/organizations/1',
          patient: 'http://localhost/patient/1',
        },
      },
    ],
    links: {
      self: 'http://localhost/threads',
    },
  };

  restServiceResult2 = {
    messages: [
      {
        text: 'Test of whether longer message texts will get their word breaks set correctly or incorrectly',
        to: {
          type: 'Patient',
          name: 'Nancy Ann Berggren',
        },
        from: {
          type: 'Department',
          name: 'TCN',
        },
        isRead: true,
        sendDate: '2013-12-19T10:25:44.877+01:00',
        readDate: '2014-01-22T11:40:00.690+01:00',
      },
      {
        text: 'Test',
        to: {
          type: 'Patient',
          name: 'Nancy Ann Berggren',
        },
        from: {
          type: 'Department',
          name: 'TCN',
        },
        isRead: false,
        sendDate: '2013-12-17T10:58:27.283+01:00',
        readDate: undefined,
      },
      {
        text: 'Test of whether longer message texts will get their word breaks set correctly or incorrectly',
        from: {
          type: 'Patient',
          name: 'Nancy Ann Berggren',
        },
        to: {
          type: 'Department',
          name: 'TCN',
        },
        isRead: true,
        sendDate: '2013-12-21T10:58:27.283+01:00',
        readDate: '2013-12-21T10:58:52.267+01:00',
      },
      {
        text: 'sidste test',
        from: {
          type: 'Patient',
          name: 'Nancy Ann Berggren',
        },
        to: {
          type: 'Department',
          name: 'TCN',
        },
        isRead: false,
        sendDate: '2013-12-24T10:58:27.283+01:00',
        readDate: undefined,
      },
    ],
    links: {
      self: `http://localhost/clinician/api/patients/me/message-threads/8`,
      sendMessage: `http://localhost/clinician/api/patients/me/message-threads/8`,
    },
  };

  list(user: any) {
    return Promise.resolve(this.restServiceResult);
  }

  get(user: any) {
    return Promise.resolve(this.restServiceResult2);
  }
}
