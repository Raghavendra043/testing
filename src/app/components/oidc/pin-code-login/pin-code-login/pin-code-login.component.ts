import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { PINCODE_SET } from "@utils/globals";
import { NativeService } from "src/app/services/native-services/native.service";
import { AuthenticationService } from "src/app/services/rest-api-services/authentication.service";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { UserSessionService } from "src/app/services/state-services/user-session.service";
import { PinCodeLoginModel } from "src/app/types/model.type";
import { ErrorResponse, JWT } from "src/app/types/response.type";
import { User } from "src/app/types/user.type";

@Component({
  selector: "app-pin-code-login",
  templateUrl: "./pin-code-login.component.html",
  styleUrls: ["./pin-code-login.component.less"],
})
export class PinCodeLoginComponent {
  model: PinCodeLoginModel = { state: "Initial" };
  root: any;

  constructor(
    private appContext: StatePassingService,
    private router: Router,
    private native: NativeService,
    private userSession: UserSessionService,
    private translate: TranslateService,
    private authentication: AuthenticationService
  ) {
    this.userSession
      .init()
      .then((root) => (this.root = root))
      .catch(() => (this.model.error = "OPENTELE_UNAVAILABLE_TEXT"));
  }

  loaded = (): boolean => {
    return this.root ? true : false;
  };

  forgotPinCode(): void {
    const confirmText = this.translate.instant(
      "LOGOUT_CONFIRM_RESET_PINCODE_MSG"
    );
    const okButtonText = this.translate.instant("OK");
    const cancelButtonText = this.translate.instant("Cancel");

    this.native.showConfirmDialog(
      confirmText,
      okButtonText,
      cancelButtonText,
      (okClicked: boolean) => {
        if (!okClicked) {
          return;
        }

        const currentUser: User = this.appContext.currentUser.get()!;
        this.authentication.logout(currentUser).subscribe(() => {
          PINCODE_SET.set(false);
          this.router.navigate(["/reset_login"]);
        });
      }
    );
  }

  login(): void {
    this.model.state = "Loading";
    const authUrl: string = this.root.links.auth;

    this.authentication
      .pinCodeLogin(authUrl, this.model.pinCode!)
      .then((data) => {
        if ("claims" in data) {
          this.onSuccess(data);
          this.model.state = "Loaded";
        } else {
          throw data;
        }
      })
      .catch((error) => this.onError(error));
  }

  onSuccess({
    claims,
    canChangePassword,
    logoutUrl,
    organizations,
  }: JWT): void {
    this.userSession.completeLogin(
      this.root,
      claims,
      canChangePassword,
      logoutUrl,
      organizations
    );
  }

  onError(response: ErrorResponse): void {
    this.model.state = "Failed";
    const status: number = response.status;
    const data = response.data;
    console.error(
      "PIN-code login failed: " +
        JSON.stringify(status, null, 4) +
        "\n" +
        JSON.stringify(data, null, 4)
    );
    switch (status) {
      case -1:
        this.router.navigate(["/login"]);
        break;

      case 401:
        if (data.code === "BAD_MFA_CREDENTIALS") {
          this.model.error = "PINCODE_BAD_CREDENTIALS";
        } else {
          this.model.error = "ACCOUNT_LOCKED";
        }
        break;
    }
  }
}
