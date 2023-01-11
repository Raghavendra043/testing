import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingState } from "@app/types/loading.type";
import { TranslateService } from "@ngx-translate/core";
import { ROOT_RESOURCE } from "@utils/globals";
import { OidcUtilsService } from "src/app/services/oidc-services/oidc-utils.service";
import { AuthenticationService } from "src/app/services/rest-api-services/authentication.service";
import { UserSessionService } from "src/app/services/state-services/user-session.service";

@Component({
  selector: "app-oidc-start-login",
  templateUrl: "./oidc-start-login.component.html",
  styleUrls: ["./oidc-start-login.component.less"],
})
export class OidcStartLoginComponent {
  errorMessage = "";
  oidcSignIn = false;
  infoText = "";
  errorDescription = "";

  constructor(
    private oidcUtils: OidcUtilsService,
    private userSession: UserSessionService,
    private authentication: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private oidcService: OidcUtilsService
  ) {}

  sendOIDCAuthRequest() {
    this.oidcUtils.sendAuthRequest();
  }

  setInitialState() {
    this.authentication.setCanChangePassword(false);

    ROOT_RESOURCE.delete();
    this.errorMessage = "";

    this.oidcSignIn = false;
    this.infoText = this.translate.instant("OIDC_INFO_TEXT");
  }

  pinCodeRequired(response: any) {
    return response && response.code === "PINCODE_REQUIRED";
  }

  startLogin(root: any) {
    const loginNotCompleted = (response: any) => {
      const status = response.status;
      const data = response.data;
      switch (status) {
        case -1:
        case 401:
          if (this.pinCodeRequired(data)) {
            console.info("Need PIN-code login");
            this.router.navigate(["/pincode_login"]);
            return;
          }

          // sessionStorage is needed since we leave the app and the comes back...
          ROOT_RESOURCE.set(root);
          console.debug(`Setting root: ${JSON.stringify(root)}`);
          console.info(
            "Unable to login using refresh token. OIDC login needed."
          );
          this.oidcSignIn = true;

          // Force oidc service to be called due to async oidc success
          // call in app.component where ROOT_RESOURCE needs to be set
          this.oidcService.runOIDC();

          break;
        default:
          console.error(
            `Silent login failed with unexpected error: ${status} ` +
              JSON.stringify(data, null, 4)
          );
          this.errorMessage = "OPENTELE_DOWN_TEXT";
          break;
      }
    };
    this.userSession.startSilentLogin(root, loginNotCompleted);
  }

  connectionError() {
    this.errorMessage = "OPENTELE_UNAVAILABLE_TEXT";
  }

  checkForErrors() {
    const params = this.oidcUtils.parseQueryString();
    if ("error" in params) {
      this.errorMessage = "OIDC_LOGIN_FAILED";
      console.error("Error from OIDC provider: " + params.error);

      if ("error_description" in params) {
        this.errorDescription = params.error_description;
        console.error("Description: " + params.error_description);
      }
      this.oidcSignIn = true;
      return;
    }
  }

  ngOnInit() {
    this.setInitialState();

    this.userSession
      .init()
      .then((res: any) => {
        this.startLogin(res);
      })
      .catch((e: any) => {
        console.error(e);
        this.connectionError();
      });
  }
}
