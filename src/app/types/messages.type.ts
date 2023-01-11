export interface ThreadsResult {
  unreadMessages: number;
  results: ThreadRef[];
  links: {
    self: string;
    patient: string;
  };
}

export interface MessagesResult {
  results: ThreadRef[];
  links: {
    self: string;
    next?: string;
    previous?: string;
  };
}

export interface ThreadRef {
  unreadFromOrganization: number;
  unreadFromPatient: number;
  organizationName: string;
  links: {
    thread: string;
    messages: string;
    organization: string;
    patient: string;
  };
}

export interface ThreadMessagesResult {
  results: Message[];
  links: object;
}

export interface MessageThread {
  unreadFromOrganization: number;
  unreadFromPatient: number;
  links: {
    self: string;
    patient: string;
    organization: string;
    sendMessage: string;
  };
}

export interface Message {
  text: string;
  to: Correspondent;
  from: Correspondent;
  isRead: boolean;
  timestamp: string;
  readDate: string;
  links: {
    attachments: [
      {
        full: string;
        thumbnail: string;
      }
    ];
  };
}

export interface Correspondent {
  type: CorrespondentType;
  name: string;
}

export type CorrespondentType = 'patient' | 'department';

export interface Department {
  name: string;
  url: string;
  unreadCount: number;
  messageThread: ThreadRef | undefined;
}
