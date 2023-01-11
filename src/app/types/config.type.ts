export interface AppConfig {
  appType: AppType;
  version: string;
  baseUrl: string;
  idleTimeoutInSeconds: number;
  idleWarningCountdownInSeconds: number;
  showSeverity: boolean;
  showReplies: boolean;
  fakeNativeEnabled: boolean;
  helpAndInfoUrl?: string;
}

export interface OIDCConfig {
  authorizationEndpoint: string;
  endSessionEndpoint?: string;
  clientId: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  invalidateSsoSession: boolean;
  enabled: boolean;
  discoveryComment?: string;
  customLogoutUrlTemplate?: string;
  scopes?: string;
  additionalParams?: Record<string, string>;
  flow?: OIDCFlow;
}

export const enum OIDCFlow {
  IMPLICIT = "id_token token",
  PKCE = "code",
}

export interface OIDCEndpoint {
  authority: string;
  redirectUrl: string;
  postLogoutRedirectUri: string;
  clientId: string;
  scope: string;
  responseType: string;
  customParamsAuthRequest?: object;
  authWellknownEndpoints: object;
}

export const enum AppType {
  PATIENT = "patientApp",
  CLINICIAN = "clinicianApp",
  CLINICIAN_AND_PATIENT = "clinicianAndPatientApp",
}
