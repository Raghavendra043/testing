import { username } from "./utils";
// Data

const individualSessionsList = (baseUrl: any) => {
  let obj: any = {
    uniqueId: "ca1ed00d-e1d2-4dc4-ae23-34a62dcd4cd9",
    description: "Patient <-> clinician session",
    schedule: null,
    status: "open",
    host: {
      email: "helen@example.com",
      firstName: "Helen",
      lastName: "Anderson",
      links: {
        clinician: `${baseUrl}/clinician/api/clinicians/1`,
      },
      present: false,
      username: "HelenAnderson",
    },
    links: {
      individualSession: `${baseUrl}/meetings/individual-sessions/1`,
    },
    participant: {
      firstName: "NancyAnn",
      lastName: "Anderson",
      links: {
        patient: `${baseUrl}/clinician/api/patients/1`,
      },
    },
  };
  return {
    results: [obj],
    total: 1,
    max: 100,
    offset: 0,
    links: {
      self: `${baseUrl}/meetings/individual-sessions`,
    },
  };
};

const individualSessionObj = (baseUrl: any) => {
  let obj: any = {
    uniqueId: "ca1ed00d-e1d2-4dc4-ae23-34a62dcd4cd9",
    description: "Patient <-> clinician session",
    schedule: null,
    status: "open",
    host: {
      email: "helen@example.com",
      firstName: "Helen",
      lastName: "Anderson",
      links: {
        clinician: `${baseUrl}/clinician/api/clinicians/1`,
      },
      present: true,
      username: "HelenAnderson",
    },
    links: {
      individualSession: `${baseUrl}/meetings/individual-sessions/1`,
    },
    participant: {
      firstName: "NancyAnn",
      lastName: "Anderson",
      links: {
        patient: `${baseUrl}/clinician/api/patients/1`,
      },
    },
  };
  return obj;
};

// API

export const individualSessions = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Individual sessions requested from: ${_username}`);

  setTimeout(() => {
    console.log("Individual sessions returned.");
    res.send(individualSessionsList(baseUrl));
  }, 5000);
};

export const individualSession = (req: any, res: any, baseUrl: any) => {
  res.send(individualSessionObj(baseUrl));
};

export const individualSessionParticipant = (req: any, res: any) => {
  const _username = username(req);
  console.log(`individual session participant set from: ${_username}`);

  const participantStatus = {
    present: true,
    roomCredentials: {
      username: "nancyann",
      host: "http://localhost:3000/",
      roomKey: "some-room-key",
      roomPin: "some-room-pin",
    },
  };

  console.log("participant status returned.");
  res.send(participantStatus);
};
