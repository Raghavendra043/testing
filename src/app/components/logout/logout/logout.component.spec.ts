import { Location } from "@angular/common";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule } from "@ngx-translate/core";
import { asyncScheduler, scheduled } from "rxjs";
import { FakeAuthenticationService2 } from "src/app/mocks/authentication-service.mock";
import { FakeStatePassingService } from "src/app/mocks/state-passing-service.mock";
import { AuthenticationService } from "src/app/services/rest-api-services/authentication.service";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { HeaderModule } from "../../header/header.module";
import { LoginComponent } from "../../login/login/login.component";
import { LogoutComponent } from "./logout.component";
import { ConfigService } from "@services/state-services/config.service";
import { FakeConfigService } from "@app/mocks/config-service.mock";

describe("LogoutComponent", () => {
  let fixture: ComponentFixture<LogoutComponent>;
  let router: Router;
  let location: Location;
  let authentication: AuthenticationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogoutComponent, LoginComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: "login",
            component: LoginComponent,
          },
        ]),
        HeaderModule,
      ],
      providers: [
        { provide: ConfigService, useClass: FakeConfigService },
        {
          provide: AuthenticationService,
          useValue: new FakeAuthenticationService2(),
        },
        {
          provide: StatePassingService,
          useValue: new FakeStatePassingService(),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authentication = TestBed.inject(AuthenticationService);
    fixture = TestBed.createComponent(LogoutComponent);
    spyOn(authentication, "logout").and.callFake(() => {
      return scheduled([void { testing: true }], asyncScheduler);
    });
    router.initialNavigation();
  });

  it("should perform logout and redirect to login page", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(authentication.logout).toHaveBeenCalled();
    expect(location.path()).toEqual("/login");
  }));
});
