export const getAfdelingB = (baseUrl: any) => {
  return {
    results: [
      {
        body: 'Test of whether longer message texts will get their word breaks set correctly or incorrectly',
        sender: {
          type: 'organization',
          name: 'Rulle',
        },
        isRead: false,
        timestamp: '2013-12-19T10:25:44.877+01:00',
        readAt: '2014-01-22T11:40:00.690+01:00',
      },
      {
        body: 'Test',
        sender: {
          type: 'organization',
          name: 'Cromwell',
        },
        isRead: false,
        timestamp: '2013-12-17T10:58:27.283+01:00',
        readAt: undefined,
      },
      {
        body: 'Test of whether longer message texts will get their word breaks set correctly or incorrectly',
        sender: {
          type: 'patient',
          name: 'Nancy Ann Berggren',
        },
        isRead: true,
        timestamp: '2013-12-21T10:58:27.283+01:00',
        readAt: '2013-12-21T10:58:52.267+01:00',
      },
      {
        body: 'sidste test',
        sender: {
          type: 'patient',
          name: 'Nancy Ann Berggren',
        },
        isRead: false,
        timestamp: '2013-12-24T10:58:27.283+01:00',
        readAt: undefined,
      },
    ],
    links: {
      self: `${baseUrl}/clinician/api/patients/me/message-threads/1`,
    },
    max: 1000,
    offset: 0,
    total: 4,
  };
};
