import { StorageVar } from '@utils/globals/storage-var';

export const AUTO_LOGIN_TOKEN = new StorageVar(
  'autoLoginRefreshToken',
  localStorage
);

export const REFRESH_TOKEN = new StorageVar('refreshToken', sessionStorage);
export const BYPASS_TOKEN_KEY = new StorageVar('authToken', sessionStorage);
export const BYPASS_CUSTOM_CLAIMS_KEY = new StorageVar(
  'authCustomClaims',
  sessionStorage
);
export const CAN_CHANGE_PASSWORD = new StorageVar<boolean>(
  'canChangePassword',
  sessionStorage
);
export const REMEMBER_ME = new StorageVar<boolean>(
  'othRememberMe',
  localStorage
);

export const LOGIN_TYPE_INFO = new StorageVar<string>(
  'loginTypeInfo',
  localStorage
);
