import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/rest-api-services/authentication.service";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { UserSessionService } from "src/app/services/state-services/user-session.service";
import { ApiRoot } from "@app/types/api.type";
import { OIDC_CONTINUE_WITH_ID, ROOT_RESOURCE } from "@utils/globals";
import { JWT } from "@app/types/response.type";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { lastValueFrom } from "rxjs";

@Component({
  selector: "app-oidc-login-success",
  templateUrl: "./oidc-login-success.component.html",
  styleUrls: ["./oidc-login-success.component.less"],
})
export class OidcLoginSuccessComponent implements OnInit {
  errorMessage = "";
  enableCreatePinCode = false;
  root: ApiRoot | undefined = undefined;

  constructor(
    private userSession: UserSessionService,
    private appContext: StatePassingService,
    private authentication: AuthenticationService,
    private router: Router,
    public oidcSecurityService: OidcSecurityService
  ) {}

  async goBackToLogin() {
    await this.router.navigate(["/login"]);
  }

  loginCompleted({ claims, canChangePassword, logoutUrl, organizations }: JWT) {
    const root = ROOT_RESOURCE.get();

    this.appContext.requestParams.set("completeLogin", () => {
      this.userSession.completeLogin(
        root!,
        claims,
        canChangePassword,
        logoutUrl,
        organizations
      );
    });

    this.appContext.requestParams.set("root", root);
    this.router.navigate(["/pincode"], {
      replaceUrl: true,
    });
  }

  setInitialState() {
    this.enableCreatePinCode = false;
    this.errorMessage = "";
  }

  async ngOnInit() {
    console.debug("OidcSuccessComponent");
    this.setInitialState();
    this.appContext.requestParams.set("softLogout", true);
    let idTokenToVerify;
    //When Invalidate SSO we need to use the stored token
    if (OIDC_CONTINUE_WITH_ID.get()) {
      idTokenToVerify = OIDC_CONTINUE_WITH_ID.get();
      OIDC_CONTINUE_WITH_ID.delete();
    } else {
      idTokenToVerify = await lastValueFrom(
        this.oidcSecurityService.getIdToken()
      );
    }

    if (!idTokenToVerify) {
      this.errorMessage = "OIDC_EXCHANGE_TOKEN_FAILED";
      throw Error("Unable to get ID Token");
    }

    const root = ROOT_RESOURCE.get();
    if (root !== null) {
      this.root = root;
      const authUrl = this.root.links.oidcAuth;
      try {
        const jwt = await lastValueFrom(
          this.authentication.oidcLogin(authUrl, idTokenToVerify)
        );
        this.loginCompleted(jwt);
      } catch (e) {
        this.errorMessage = "OIDC_EXCHANGE_TOKEN_FAILED";
        console.error(e);
      }
    } else {
      throw Error("Unable to get root");
    }
  }
}
