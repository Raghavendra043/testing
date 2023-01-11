import { WithLinks } from './utility.type';

export type DeviceOS = 'iOS' | 'Android';

export interface DeviceRegistration {
  patientUrl: string;
  deviceToken: string;
  deviceOS: DeviceOS;
}

export interface DeviceResult {
  results: (DeviceRegistration & WithLinks<'device'>)[];
  total: number;
}
