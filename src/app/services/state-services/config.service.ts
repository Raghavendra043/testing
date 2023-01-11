import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppConfig, AppType, OIDCConfig } from "@app/types/config.type";
import { LocationStrategy } from "@angular/common";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private appConfig: AppConfig;
  private oidcConfig: OIDCConfig;
  loaded = false;

  constructor(
    private locationStrategy: LocationStrategy,
    private http: HttpClient
  ) {
    // Sets placeholder configs
    this.appConfig = {
      appType: AppType.CLINICIAN_AND_PATIENT,
      version: '',
      fakeNativeEnabled: false,
      idleTimeoutInSeconds: 600,
      idleWarningCountdownInSeconds: 0.1,
      showSeverity: false,
      showReplies: false,
      baseUrl: "/",
    };
    this.oidcConfig = {
      authorizationEndpoint:
        "https: //demo.identityserver.io/connect/authorize",
      endSessionEndpoint: "https: //demo.identityserver.io/connect/endsession",
      clientId: "implicit",
      redirectUri: "http://localhost:8000/placeholder",
      postLogoutRedirectUri: "http://localhost:8000/placeholder",
      invalidateSsoSession: false,
      enabled: false,
    };
  }

  async loadConfig(): Promise<boolean> {
    const baseHref = this.locationStrategy.getBaseHref();
    const appConfigFile = `${baseHref}assets/config/app.config.json`;
    const oidcConfigFile = `${baseHref}assets/config/oidc.config.json`;

    let appConfig = this.http.get<AppConfig>(appConfigFile);
    this.appConfig = await lastValueFrom(appConfig);

    let oidcConfig = this.http.get<OIDCConfig>(oidcConfigFile);
    this.oidcConfig = await lastValueFrom(oidcConfig);

    this.loaded = true;
    return true;
  }

  getAppConfig(): AppConfig {
    if (this.loaded) {
      return this.appConfig;
    } else {
      throw new Error('APP CONFIG NOT LOADED!');
    }
  }

  getOIDCConfig(): OIDCConfig {
    if (this.loaded) {
      return this.oidcConfig;
    } else {
      throw new Error('APP CONFIG NOT LOADED!');
    }
  }
}
