import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { OidcUtilsService } from "@services/oidc-services/oidc-utils.service";
import { PINCODE_SET } from "@utils/globals";
import { AuthenticationService } from "src/app/services/rest-api-services/authentication.service";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { SetPinCodeModel } from "src/app/types/model.type";

@Component({
  selector: "app-set-pin-code",
  templateUrl: "./set-pin-code.component.html",
  styleUrls: ["./set-pin-code.component.less"],
})
export class SetPinCodeComponent {
  model: SetPinCodeModel;
  root: any;
  completeLogin: any;

  constructor(
    private appContext: StatePassingService,
    private router: Router,
    private translate: TranslateService,
    private authentication: AuthenticationService,
    private oidcService: OidcUtilsService
  ) {
    this.model = {
      state: "Initial",
      pinCode: undefined,
      pinCodeRepeat: undefined,
      error: "",
      info: this.translate.instant("SET_PIN_CODE_INFO_TEXT"),
    };

    this.initModel();
  }

  goBackToLogin = () => {
    this.authentication.clearAllTokens();
    this.oidcService.sendLogoutRequest(); // Needs to logout unless the user will be redirected
    this.router.navigate(["/login"]);
  };

  getPinCode = () => {};

  pinCodeMismatch = () => {
    return (
      !this.model.pinCode ||
      this.model.pinCode.length < 4 ||
      this.model.pinCode !== this.model.pinCodeRepeat
    );
  };

  savePinCode = () => {
    this.model.state = "Loading";
    const savePinCodeFailed = (response: object) => {
      this.model.state = "Failed";
      console.error("Failed to save PIN-code.");
      console.error(`Data: ${response}`);
      console.error(JSON.stringify(response));

      this.model.pinCode = undefined;
      this.model.pinCodeRepeat = undefined;
      this.model.error = "LOGIN_FAILED_TO_SET_PIN_CODE";
    };

    this.authentication
      .setPinCode(this.root.links.mfaPinCode, this.model.pinCode)
      .then((response: any) => {
        PINCODE_SET.set(true);
        this.model.state = "Loaded";
        return this.completeLogin(response);
      })
      .catch(savePinCodeFailed);
  };

  initModel() {
    if (
      !this.appContext.requestParams.containsKey("completeLogin") ||
      !this.appContext.requestParams.containsKey("root")
    ) {
      this.router.navigate(["/login"]);
      return;
    }

    this.completeLogin =
      this.appContext.requestParams.getAndClear("completeLogin");

    this.root = this.appContext.requestParams.getAndClear("root");
  }
}
