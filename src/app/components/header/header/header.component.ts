import { Component, Input, OnChanges, ApplicationRef } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "@services/rest-api-services/authentication.service";
import { ConfigService } from "@services/state-services/config.service";
import { NativeService } from "src/app/services/native-services/native.service";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { AppConfig } from "src/app/types/config.type";

@Component({
  selector: "header-menu",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.less"],
})
export class HeaderComponent implements OnChanges {
  @Input() showBackBtn = false;
  @Input() onBackFun?: () => void;

  @Input() showHomeBtn = false;
  @Input() onHomeFun: () => void = () => this.router.navigate(["/menu"]);

  @Input() isClinician = false;
  @Input() title = "";
  @Input() showChangePasswordBtn = false;
  @Input() showLogoutBtn = false;
  @Input() showLogo = false;

  constructor(
    private applicationRef: ApplicationRef,
    private router: Router,
    private translate: TranslateService,
    private native: NativeService,
    private appContext: StatePassingService,
    private config: ConfigService,
    private authentication: AuthenticationService // Is not unused. Used to go back as a clinician
  ) {}

  ngOnChanges(): void {
    this.title = this.title ? this.translate.instant(this.title) : "";
  }

  canClickLogo(): boolean {
    return this.helpAndInfoUrl() ? true : false;
  }

  helpAndInfoUrl(): string | undefined {
    const appConfig: AppConfig = this.config.getAppConfig();
    return appConfig.helpAndInfoUrl;
  }

  clickLogo() {
    const helpUrl = this.helpAndInfoUrl();
    if (this.canClickLogo() && helpUrl !== undefined) {
      this.native.openUrl(helpUrl);
    }
  }

  goHome() {
    if (this.onHomeFun) {
      this.onHomeFun();
    } else {
      this.router.navigate(["/menu"]);
    }
  }

  goBack = (): void => {
    if (this.onBackFun) {
      this.onBackFun();
    } else {
      globalThis.history.back();
    }
  };

  goLogout = () => {
    const confirmText = this.translate.instant("LOGOUT_CONFIRM_MSG");
    const okButtonText = this.translate.instant("OK");
    const cancelButtonText = this.translate.instant("CANCEL");

    this.native.showConfirmDialog(
      confirmText,
      okButtonText,
      cancelButtonText,
      (okClicked: boolean) => {
        if (!okClicked) {
          return;
        } else {
          this.router.navigate(["/logout"]);
          setTimeout(() => this.applicationRef.tick(), 100);
        }
      }
    );
  };

  goChangePassword = () => {
    this.router.navigate(["/change_password"]);
  };

  goClinicianMenu() {
    this.appContext.requestParams.getAndClear("selectedPatient");
    this.router.navigate(["/clinician_menu"]);
  }
}
