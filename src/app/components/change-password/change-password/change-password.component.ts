import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/services/rest-api-services/authentication.service";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { ChangePasswordModel } from "src/app/types/model.type";
import { ErrorResponse } from "src/app/types/response.type";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.less"],
})
export class ChangePasswordComponent implements OnInit {
  model: ChangePasswordModel = {
    showProgress: false,
  };

  @ViewChild(NgForm) ngForm!: NgForm;

  constructor(
    private appContext: StatePassingService,
    private authentication: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    if (
      this.appContext.requestParams.containsKey("forceChange") &&
      this.appContext.requestParams.getAndClear("forceChange") === true
    ) {
      this.model.forceChange = true;
      this.model.error = "CHANGE_PASSWORD_EXPIRED";
    } else {
      this.model.forceChange = false;
    }
  }

  tryChangePassword = (): void => {
    if (this.model.currentPassword! == this.model.password!) {
      this.model.error = "CHANGE_PASSWORD_UNIQUE";
      return;
    }

    this.model.showProgress = true;

    const onSuccess = (): void => {
      this.model.showProgress = false;
      this.router.navigate(["login"]);
    };

    const onError = (response: ErrorResponse): void => {
      const data = response.data;
      const status = response.status;
      this.model.showProgress = false;

      switch (status) {
        case 400: {
          const errorCode = data.errors?.[0].error.toUpperCase();
          this.model.error = `CHANGE_PASSWORD_${errorCode}`;
          break;
        }

        case 401:
          this.model.error = "BAD_CREDENTIALS";
          break;

        default:
          this.model.error = "OPENTELE_DOWN_TEXT";
      }
    };

    const user = this.appContext.currentUser.get();
    const userInfo = this.appContext.requestParams.get<any>("userInfo");

    this.authentication
      .changePassword(
        user?.username || userInfo.username,
        user?.links.changePassword || userInfo.changePasswordUrl,
        this.model.currentPassword!,
        this.model.password!
      )
      .subscribe({ next: onSuccess, error: onError });
  };

  changeIfValid(): void {
    if (this.model.password !== this.model.passwordRepeat) {
      this.model.error = "CHANGE_PASSWORD_FORM_ERROR_MATCH";
    } else {
      this.tryChangePassword();
    }
  }

  submit(): void {
    delete this.model.error;
    this.changeIfValid();
  }
}
