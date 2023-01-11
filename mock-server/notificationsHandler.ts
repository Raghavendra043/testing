import { username } from './utils';

// Data

const registeredDevices = (baseUrl: any) => {
  let obj: any = {
    offset: 0,
    max: 100,
    total: 0,
    results: [],
    links: {
      self: `${baseUrl}/notifications/devices`,
    },
  };
  return obj;
};

// API

export const list = (req: any, res: any, baseUrl: any) => {
  const _username = username(req);
  console.log(`Registered devices list requested from: ${_username}`);

  console.log('Registered devices returned.');
  res.send(registeredDevices(baseUrl));
};

export const create = (req: any, res: any) => {
  res.status(201).end();
};
