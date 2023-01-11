import { Location } from "@angular/common";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthResponse } from "@app/types/response.type";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";
import { FakeAuthenticationService3 } from "src/app/mocks/authentication-service.mock";
import { AuthenticationService } from "src/app/services/rest-api-services/authentication.service";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { HeaderModule } from "../../header/header.module";
import { LoginComponent } from "../../login/login/login.component";
import { MenuComponent } from "../../menu/menu/menu.component";
import { ChangePasswordComponent } from "./change-password.component";
import { ConfigService } from "@services/state-services/config.service";
import { FakeConfigService } from "@app/mocks/config-service.mock";

describe("ChangePasswordComponent", () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let appContext: StatePassingService;
  let router: Router;
  let location: Location;
  let authentication: FakeAuthenticationService3;

  beforeEach(async () => {
    authentication = new FakeAuthenticationService3();

    appContext = new StatePassingService(router);
    appContext.requestParams.set("userInfo", {
      username: "nancyann",
      changePasswordUrl: "http://localhost/idp2/users/auth",
    });

    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent, LoginComponent, MenuComponent],
      providers: [
        { provide: ConfigService, useClass: FakeConfigService },
        {
          provide: AuthenticationService,
          useValue: authentication,
        },
        {
          provide: StatePassingService,
          useValue: appContext,
        },
      ],
      imports: [
        FormsModule,
        HeaderModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes(
          //TODO: Should ideally be imported but relative path can't match
          [
            {
              path: "login",
              component: LoginComponent,
            },
            {
              path: "menu",
              component: MenuComponent,
            },
          ]
        ),
      ],
    }).compileComponents();
  });

  beforeEach((done) => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router.initialNavigation();
    fixture.whenStable().then(() => done());
  });

  it("should call rest client when submitting new password", fakeAsync(() => {
    component.model.currentPassword = "4321";
    component.model.password = "1234";
    component.model.passwordRepeat = "1234";

    component.submit();
    tick();
    fixture.detectChanges();

    const userInfo = appContext.requestParams.get<any>("userInfo");

    expect(userInfo).toBeDefined();
    expect(authentication.calledWithUsername).toEqual(userInfo.username);
    expect(authentication.calledWithChangePwUrl).toEqual(
      userInfo.changePasswordUrl
    );
    expect(authentication.calledWithCurrentPassword).toBe("4321");
    expect(authentication.calledWithNewPassword).toBe("1234");
  }));

  it("should redirect to menu on successfull change of password", fakeAsync(() => {
    component.model = {
      ...component.model,
      currentPassword: "4321",
      password: "1234",
      passwordRepeat: "1234",
    };

    component.submit();
    tick();
    fixture.detectChanges();
    expect(location.path()).toBe("/login"); // login should redirect to menu
  }));

  it("should show progress message while waiting for server response", fakeAsync(() => {
    let progressWhileChanging = false;
    authentication.changePassword = () => {
      if (component.model.showProgress) {
        progressWhileChanging = true;
      }
      return of({} as AuthResponse);
    };
    component.model.currentPassword = "4321";
    component.model.password = "1234";
    component.model.passwordRepeat = "1234";

    component.submit();
    tick();
    fixture.detectChanges();
    expect(progressWhileChanging).toBeTruthy();
    expect(component.model.showProgress).toBeFalsy();
  }));

  it("should show error message when change password failed on server", fakeAsync(() => {
    authentication.shouldFailValidation = true;

    component.model.currentPassword = "4321";
    component.model.password = "1234";
    component.model.passwordRepeat = "1234";

    component.submit();
    tick();
    fixture.detectChanges();

    expect(component.model.error).toBe("CHANGE_PASSWORD_AT_LEAST_8_CHARS");
  }));

  it("should be possible to change inputted password on errors", fakeAsync(() => {
    authentication.shouldFailValidation = true;

    component.model.currentPassword = "4321";
    component.model.password = "1234";
    component.model.passwordRepeat = "1234";

    component.submit();
    tick();
    fixture.detectChanges();

    expect(component.model.showProgress).toBeFalsy();
  }));

  it("should have the correct form controls", () => {
    const controls = component.ngForm.form.controls;
    expect(controls).toBeDefined();
    expect(controls).not.toHaveSize(0);
    expect(controls["currentPassword"]).toBeDefined();
    expect(controls["password"]).toBeDefined();
    expect(controls["passwordRepeat"]).toBeDefined();
  });

  it("should mark form valid when everything is ok", () => {
    component.ngForm.form.controls["currentPassword"].setValue("4321");
    component.ngForm.form.controls["password"].setValue("1234");
    component.ngForm.form.controls["passwordRepeat"].setValue("1234");

    expect(component.ngForm.form.invalid).toBeFalsy();
  });

  it("should mark form invalid when nothing has been entered", () => {
    expect(component.ngForm.form.invalid).toBeTruthy();
  });

  it("should mark form invalid when repeat password is missing", () => {
    component.ngForm.form.controls["password"].setValue("1234");

    expect(component.ngForm.form.invalid).toBeTruthy();
  });

  it("should mark form invalid when password is missing", () => {
    component.ngForm.form.controls["passwordRepeat"].setValue("1234");
    expect(component.ngForm.form.invalid).toBeTruthy();
  });

  it("should mark form invalid when passwords do not match", () => {
    component.ngForm.form.controls["currentPassword"].setValue("4321");
    component.ngForm.form.controls["password"].setValue("1234");
    component.ngForm.form.controls["passwordRepeat"].setValue("12345");

    component.submit();

    expect(component.model.error).toBe("CHANGE_PASSWORD_FORM_ERROR_MATCH");
  });
});
