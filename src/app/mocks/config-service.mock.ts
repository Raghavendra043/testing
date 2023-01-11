import { Injectable } from "@angular/core";
import { AppConfig, AppType, OIDCConfig } from "@app/types/config.type";

Injectable();
export class FakeConfigService {
  appConfig: AppConfig = {
    appType: AppType.CLINICIAN_AND_PATIENT,
    version: "2.76.1",
    fakeNativeEnabled: true,
    idleTimeoutInSeconds: 600,
    idleWarningCountdownInSeconds: 0.1,
    showSeverity: true,
    showReplies: true,
    baseUrl: "http://localhost:7000/",
  };

  oidcConfig: OIDCConfig = {
    authorizationEndpoint: "https://demo.identityserver.io/connect/authorize",
    endSessionEndpoint: "https://demo.identityserver.io/connect/endsession",
    clientId: "implicit",
    redirectUri: "http://localhost:8000/client-citizen/",
    postLogoutRedirectUri: "http://localhost:8000/client-citizen/",
    invalidateSsoSession: false,
    enabled: false,
  };

  async loadConfig(): Promise<boolean> {
    return true;
  }

  getAppConfig(): AppConfig {
    return this.appConfig;
  }

  getOIDCConfig(): OIDCConfig {
    return this.oidcConfig;
  }
}

export const appConfig: AppConfig = {
  appType: AppType.CLINICIAN_AND_PATIENT,
  version: "2.76.1",
  fakeNativeEnabled: true,
  idleTimeoutInSeconds: 600,
  idleWarningCountdownInSeconds: 0.1,
  showSeverity: true,
  showReplies: true,
  baseUrl: "http://localhost:7000/",
};

export const oidcConfig: OIDCConfig = {
  authorizationEndpoint: "https://demo.identityserver.io/connect/authorize",
  endSessionEndpoint: "https://demo.identityserver.io/connect/endsession",
  clientId: "implicit",
  redirectUri: "http://localhost:8000/client-citizen/",
  postLogoutRedirectUri: "http://localhost:8000/client-citizen/",
  invalidateSsoSession: false,
  enabled: false,
};
