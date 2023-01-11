import { Injectable } from "@angular/core";
import { ActivatedRoute, CanActivate, Router } from "@angular/router";
import { OIDCConfig } from "src/app/types/config.type";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { ConfigService } from "@services/state-services/config.service";
import {
  OIDC_CONTINUE_WITH_ID,
  PINCODE_SET,
  ROOT_RESOURCE,
} from "@utils/globals";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OidcUtilsService implements CanActivate {
  oidcConfig: OIDCConfig;

  constructor(
    private config: ConfigService,
    private route: ActivatedRoute,
    private router: Router,
    public oidcSecurityService: OidcSecurityService
  ) {
    this.oidcConfig = this.config.getOIDCConfig();
  }

  canActivate(): boolean {
    const oidcEnabled: boolean = this.oidcConfig.enabled;
    return oidcEnabled;
  }

  endSession(postLogoutRedirectUri: string): string {
    if (this.oidcConfig.endSessionEndpoint) {
      const newEndSessionUrl = new URL(this.oidcConfig.endSessionEndpoint);
      newEndSessionUrl.searchParams.append(
        "post_logout_redirect_uri",
        postLogoutRedirectUri
      );
      return newEndSessionUrl.href;
    } else {
      if (this.oidcConfig.customLogoutUrlTemplate) {
        const customLogoutUrlTemplate = this.oidcConfig.customLogoutUrlTemplate
          .replaceAll("{postLogoutRedirectUri}", postLogoutRedirectUri)
          .replaceAll("{clientId}", this.oidcConfig.clientId);
        return customLogoutUrlTemplate;
      } else {
        console.error("No custom logout url defined");
        return "";
      }
    }
  }

  sendAuthRequest() {
    this.oidcSecurityService.authorize();
  }

  sendLogoutRequest() {
    const url = this.endSession(this.oidcConfig.postLogoutRedirectUri);
    console.debug("sendLogoutRequest() Url: " + url);
    globalThis.location.replace(url);
    this.oidcSecurityService.logoff(); // Log off in service context
  }

  invalidateSsoSession() {
    this.sendLogoutRequest();
  }

  parseQueryString(): Record<string, string> {
    const params = this.route.snapshot.queryParams;
    console.log(`Query params: ${JSON.stringify(params)}`);
    return params;
  }

  async runOIDC() {
    const idTokenToVerify = OIDC_CONTINUE_WITH_ID.get();

    if (idTokenToVerify !== null) {
      console.debug(
        "OIDC ID token from session defined, navigating to success"
      );
      await this.router.navigate(["/oidc/success"]);
      console.debug(
        `Continuing OIDC login flow after endsession request: ${this.router.url}`
      );
      return;
    }

    const currentUrl: string = this.router.url;
    if (currentUrl.indexOf("/oidc/") > -1) {
      console.debug("route contains /oidc/, so returning...");
      return;
    } else {
      try {
        const {
          isAuthenticated,
          userData,
          accessToken,
          idToken,
          configId,
          errorMessage,
        } = await lastValueFrom(this.oidcSecurityService.checkAuth());

        console.debug(`OIDC is authenticated: ${isAuthenticated}`);

        if (errorMessage) {
          console.error(`OIDC plugin failed with error: ${errorMessage}`);
          console.error(JSON.stringify(errorMessage));
        }

        if (isAuthenticated && idToken) {
          console.debug("OIDC ID token received.");
          if (!ROOT_RESOURCE.get() || PINCODE_SET.get()) {
            if (PINCODE_SET.get()) {
              console.debug(
                "OIDC: Pincode already set. Using default routing."
              );
            } else {
              console.debug("OIDC: No root available. Using default routing.");
            }
            return;
          }

          if (this.config.getOIDCConfig().invalidateSsoSession) {
            console.debug("Redirecting to invalidate sso");
            await this.router.navigate(["/oidc/invalidate_sso"]);
          } else {
            console.debug("Redirecting to OIDC success");
            await this.router.navigate(["/oidc/success"]);
          }
        } else {
          console.debug("User is not authenticated with ID token");
        }

        return;
      } catch (e: any) {
        console.error(`OIDC failed with error: ${e}`);
        console.error(JSON.stringify(e));
        return;
      }
    }
  }
}
