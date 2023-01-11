import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderModule } from '@components/header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { OidcLoginSuccessComponent } from './oidc-login-success.component';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { FakeConfigService } from '@app/mocks/config-service.mock';
import { ConfigService } from '@services/state-services/config.service';
import { AuthenticationService } from '@services/rest-api-services/authentication.service';
import { UserSessionService } from '@services/state-services/user-session.service';
import { ROOT_RESOURCE } from '@utils/globals';
import { SetPinCodeComponent } from '@components/oidc/set-pin-code/set-pin-code/set-pin-code.component';
import { PinCodeLoginComponent } from '@components/oidc/pin-code-login/pin-code-login/pin-code-login.component';

class FakeOidcSecurityService {
  getIdToken(): Observable<string> {
    return of('some_token');
  }
}

class FakeAuthenticationService {
  callOnErrorCallback = false;

  oidcLogin(_authUrl: any, _token: any) {
    if (this.callOnErrorCallback) {
      return throwError({});
    } else {
      return of({
        claims: {},
        canChangePassword: false,
        logoutUrl: 'http://localhost/logout',
      });
    }
  }
}
class FakeUserSessionService {
  completeLogin(_root: any, _claims: any, _canChangePw: any, _logoutUrl: any) {}
}

describe('OidcLoginSuccessComponent', () => {
  let component: OidcLoginSuccessComponent;
  let fixture: ComponentFixture<OidcLoginSuccessComponent>;
  let router: Router;
  let location: Location;
  let configService: any;
  let authentication: FakeAuthenticationService;

  async function init(fn?: any) {
    configService = new FakeConfigService();
    configService.oidcConfig = {
      authorizationEndpoint: 'https://demo.identityserver.io/connect/authorize',
      endSessionEndpoint: 'https://demo.identityserver.io/connect/endsession',
      clientId: 'implicit',
      redirectUri: 'http://localhost:8000/app/',
      postLogoutRedirectUri: 'http://localhost:8000/app/',
      additionalParams: {
        foo: 'bar',
        baz: '42',
      },
    };
    ROOT_RESOURCE.set({
      //@ts-ignore
      links: {
        oidcAuth: 'http://host.oth.io/idp2/login-with-oidc-token',
      },
    });

    await TestBed.configureTestingModule({
      declarations: [OidcLoginSuccessComponent],
      providers: [
        { provide: ConfigService, useValue: configService },
        {
          provide: AuthenticationService,
          useValue: new FakeAuthenticationService(),
        },
        { provide: UserSessionService, useValue: new FakeUserSessionService() },
        {
          provide: OidcSecurityService,
          useValue: new FakeOidcSecurityService(),
        },
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'pincode_login',
            component: PinCodeLoginComponent,
          },
          { path: 'pincode', component: SetPinCodeComponent },
        ]),
        HeaderModule,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    //@ts-ignore
    authentication = TestBed.inject(AuthenticationService);
    if (fn) {
      fn();
    }
    fixture = TestBed.createComponent(OidcLoginSuccessComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  }

  it('should create', async () => {
    await init();
    expect(component).toBeTruthy();
  });

  it('should redirect to set pincode page on OIDC success', async () => {
    await init();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(location.path()).toEqual('/pincode');
  });

  it('should show error message if login with oidc token to idp2 fails', async () => {
    const initFn = () => {
      authentication.callOnErrorCallback = true;
    };

    await init(initFn);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.errorMessage).toEqual('OIDC_EXCHANGE_TOKEN_FAILED');
  });
});
