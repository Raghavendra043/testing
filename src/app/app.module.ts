import { NgModule, Provider, APP_INITIALIZER } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "@app/app-routing.module";
import { AppComponent } from "@app/app.component";
import { OIDCConfig, OIDCFlow } from "@app/types/config.type";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { LoadingModule } from "@app/components/loading/loading.module";
import { interceptorProviders } from "@app/interceptors";
import { ConfigService } from "@services/state-services/config.service";
import { LocationStrategy } from "@angular/common";
import {
  AuthModule,
  OpenIdConfiguration,
  StsConfigLoader,
  StsConfigStaticLoader,
} from "angular-auth-oidc-client";

// AoT requires an exported function for factories
export function HttpLoaderFactory(
  locationStrategy: LocationStrategy,
  httpClient: HttpClient
) {
  const baseHref = locationStrategy.getBaseHref();
  return new TranslateHttpLoader(
    httpClient,
    `${baseHref}assets/i18n/`,
    ".json"
  );
}

export function initConfig(config: ConfigService) {
  return () => config.loadConfig();
}

const providers: Provider[] = [
  interceptorProviders,
  {
    provide: APP_INITIALIZER,
    useFactory: initConfig,
    deps: [ConfigService],
    multi: true,
  },
];

const authFactory = (configService: ConfigService) => {
  const buildAuthModuleConfig = (config: OIDCConfig): OpenIdConfiguration => {
    const getScopes = (scopes: any): string => {
      if (!scopes || Object.entries(scopes).length === 0) {
        return "openid profile";
      }
      return scopes;
    };

    const setFlow = (config: OIDCConfig): OIDCFlow => {
      return config.flow ? config.flow : OIDCFlow.IMPLICIT;
    };

    const authConfig: OpenIdConfiguration = {
      authority: config.authorizationEndpoint,
      redirectUrl: config.redirectUri,
      postLogoutRedirectUri: config.postLogoutRedirectUri,
      clientId: config.clientId,
      scope: getScopes(config.scopes),
      responseType: setFlow(config),
    };

    if (authConfig.responseType === OIDCFlow.IMPLICIT) {
      // Hack to force using fragments in implicit flow
      const fragment = { response_mode: "fragment" };
      const additionalParams = config.additionalParams
        ? config.additionalParams
        : {};
      const params = { ...fragment, ...additionalParams };
      authConfig.customParamsAuthRequest = params;
    } else {
      // Only use the spcified additional params for PKCE flow.
      if (config.additionalParams) {
        authConfig.customParamsAuthRequest = config.additionalParams;
      }
    }

    if (
      authConfig.customParamsAuthRequest &&
      configService.getOIDCConfig().enabled
    ) {
      console.debug("Using the following additional params for authorization");
      console.debug(authConfig.customParamsAuthRequest);
    }

    return authConfig;
  };

  const config = configService.getOIDCConfig();
  const OIDCconfig = buildAuthModuleConfig(config);
  if (config.enabled) {
    console.debug("OIDC config for auth module build:");
    console.debug(OIDCconfig);
  }

  return new StsConfigStaticLoader(OIDCconfig);
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    LoadingModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [LocationStrategy, HttpClient],
      },
    }),
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: authFactory,
        deps: [ConfigService],
      },
    }),
    NgIdleKeepaliveModule.forRoot(),
  ],
  providers: providers,
  bootstrap: [AppComponent],
})
export class AppModule {}
