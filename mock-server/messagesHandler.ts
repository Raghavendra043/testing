import { username } from './utils';
import { getAfdelingB } from './messageThreads/afdelingB';
import { getObstetrisk } from './messageThreads/obstetrisk';
import { getTcn } from './messageThreads/tcn';

// Data

const messageThreadsList = (baseUrl: any) => {
  return {
    links: {
      self: `${baseUrl}/chat/threads/`,
    },
    max: 100,
    offset: 0,
    results: [
      {
        latestMessageAt: '2021-12-16T15:15:57.244424Z',
        links: {
          messages: `${baseUrl}/chat/threads/1/messages`,
          organization: `${baseUrl}/organizations/organizations/123`,
          patient: `${baseUrl}/clinician/api/patients/me`,
          thread: `${baseUrl}/chat/threads/1`,
        },
        organizationName: 'Department A',
        unreadFromOrganization: 2,
        unreadFromPatient: 2,
      },
    ],
    total: 1,
  };
};

// API

export const list = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Message thread list requested from: ${_username}`);

  if (_username === 'messagesNoRecipients') {
    res.send([]);
    console.log('Empty message threads list returned');
    return;
  }

  if (_username === 'rene') {
    res.send({
      links: {
        self: `${baseUrl}/chat/threads/`,
      },
      max: 100,
      offset: 0,
      results: [
        {
          latestMessageAt: '2021-12-16T15:15:57.244424Z',
          links: {
            messages: `${baseUrl}/chat/threads/6/messages`,
            organization: `${baseUrl}/organizations/organizations/123`,
            patient: `${baseUrl}/clinician/api/patients/me`,
            thread: `${baseUrl}/chat/threads/6`,
          },
          organizationName: 'Obstetrisk Y, AUH, RM',
          unreadFromOrganization: 2,
          unreadFromPatient: 2,
        },
      ],
      total: 1,
    });
    return;
  }

  console.log('Message threads returned.');
  res.send(messageThreadsList(baseUrl));
};

export const get = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Messages thread requested from: ${_username}`);
  const threadId = req.params.id;
  console.log(`Message thread id ${threadId}`);

  if (_username === 'messagesNoMessages') {
    console.log('Empty message thread returned.');

    res.send({
      latestMessageAt: '2021-12-16T15:15:57.244424Z',
      links: {
        messages: `${baseUrl}/chat/threads/${threadId}/messages`,
        organization: `${baseUrl}/organizations/organizations/123`,
        patient: `${baseUrl}/clinician/api/patients/me`,
        thread: `${baseUrl}/chat/threads/${threadId}`,
      },
      organizationName: 'Department A',
      unreadFromOrganization: 2,
      unreadFromPatient: 2,
    });

    return;
  }

  console.log('Messages returned.');

  switch (threadId) {
    case '1':
      res.send(getAfdelingB(baseUrl));
      break;
    case '6':
      res.send(getObstetrisk(baseUrl));
      break;
    case '8':
      res.send(getTcn(baseUrl));
      break;
    default:
      res.status(404).end();
  }
};

export const create = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Messages POST requested from: ${_username}`);

  if (_username === 'messagesNoNewMessage') {
    console.log("Can't send new message.");
    res.status(500).end();
    return;
  }

  console.log('New message successfully send.');
  res.status(201).end();
};

export const read = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Thread read POST requested from: ${_username}`);

  console.log('Thread marked as read.');
  res.status(201).end();
};
