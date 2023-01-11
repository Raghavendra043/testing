import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FakeConfigService } from "@app/mocks/config-service.mock";
import { HeaderModule } from "@components/header/header.module";
import { TranslateModule } from "@ngx-translate/core";
import { OidcUtilsService } from "@services/oidc-services/oidc-utils.service";
import { AuthenticationService } from "@services/rest-api-services/authentication.service";
import { ConfigService } from "@services/state-services/config.service";
import { StatePassingService } from "@services/state-services/state-passing.service";
import { Utils } from "@services/util-services/util.service";
import { OidcSecurityService } from "angular-auth-oidc-client";

import { SetPinCodeComponent } from "./set-pin-code.component";

describe("SetPinCodeComponent", () => {
  let component: SetPinCodeComponent;
  let fixture: ComponentFixture<SetPinCodeComponent>;
  let appContext: StatePassingService;
  let router: Router;
  let authentication: AuthenticationService;
  let httpClient: HttpClient;
  let utils: Utils;

  class FakeOidcUtilsService extends OidcUtilsService {}

  beforeEach(async () => {
    utils = new Utils();
    appContext = new StatePassingService(router);
    authentication = new AuthenticationService(appContext, httpClient, utils);

    await TestBed.configureTestingModule({
      declarations: [SetPinCodeComponent],
      providers: [
        { provide: ConfigService, useValue: new FakeConfigService() },
        { provide: StatePassingService, useValue: appContext },
        { provide: AuthenticationService, useValue: authentication },
        { provide: OidcUtilsService, useValue: FakeOidcUtilsService },
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule,
        HeaderModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPinCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
