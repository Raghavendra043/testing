import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FakeConfigService } from '@app/mocks/config-service.mock';
import { HeaderModule } from '@components/header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { OidcUtilsService } from '@services/oidc-services/oidc-utils.service';
import { AuthenticationService } from '@services/rest-api-services/authentication.service';
import { ConfigService } from '@services/state-services/config.service';
import { UserSessionService } from '@services/state-services/user-session.service';
import { Location } from '@angular/common';
import { OidcStartLoginComponent } from './oidc-start-login.component';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { PinCodeLoginComponent } from '@components/oidc/pin-code-login/pin-code-login/pin-code-login.component';
import { SetPinCodeComponent } from '@components/oidc/set-pin-code/set-pin-code/set-pin-code.component';

class FakeUserSessionService {
  init() {
    return Promise.resolve({ thisIsRoot: true });
  }
  loginReturnStatus = 401;
  loginReturnCode = {};
  startSilentLogin(_root: any, onNotCompleted: any) {
    onNotCompleted({
      status: this.loginReturnStatus,
      data: this.loginReturnCode,
    });
  }
}

class FakeAuthenticationService {
  canChangePassword = true;
  setCanChangePassword(enabled: any) {
    this.canChangePassword = enabled;
  }
}

class FakeOidcUtilsService {
  sendAuthRequest() {
    const redirectUri = 'http://localhost:8000/client-citizen/';
    const nonce = new Date().toISOString();

    const authenticationUrl =
      'https://demo.identityserver.io/connect/authorize' +
      '?client_id=' +
      'implicit' +
      '&redirect_uri=' +
      encodeURIComponent(redirectUri) +
      '&scope=' +
      encodeURIComponent('openid profile email') +
      '&response_type=' +
      encodeURIComponent('id_token') +
      '&response_mode=fragment' +
      '&nonce=' +
      encodeURIComponent(nonce) +
      '&foo=bar&baz=42';

    globalThis.location.replace(authenticationUrl);
  }
}

describe('OidcStartLoginComponent', () => {
  let component: OidcStartLoginComponent;
  let fixture: ComponentFixture<OidcStartLoginComponent>;
  let router: Router;
  let location: Location;
  let configService: any;
  let userSession: FakeUserSessionService;
  let authentication: FakeAuthenticationService;

  async function init(fn?: any) {
    // @ts-ignore
    globalThis = {
      location: {
        href: 'http://www.default.com',
        replace: function (url: any) {
          this.href = url;
        },
      },
      navigator: {},
      sessionStorage: {
        removeItem: function () {},
        setItem: function () {},
        getItem: function (): any {
          return null;
        },
      },
    };
    
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

    await TestBed.configureTestingModule({
      declarations: [OidcStartLoginComponent],
      providers: [
        { provide: ConfigService, useValue: configService },
        { provide: OidcUtilsService, useValue: new FakeOidcUtilsService() },
        {
          provide: AuthenticationService,
          useValue: new FakeAuthenticationService(),
        },
        { provide: UserSessionService, useValue: new FakeUserSessionService() },
        OidcSecurityService,
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
    userSession = TestBed.inject(UserSessionService);
    //@ts-ignore
    authentication = TestBed.inject(AuthenticationService);
    if (fn) {
      fn();
    }
    fixture = TestBed.createComponent(OidcStartLoginComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  }

  it('should create', async () => {
    await init();
    expect(component).toBeTruthy();
  });

  it('should require OIDC login when user has no valid login', async () => {
    await init();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.oidcSignIn).toBeTruthy();
  });

  it('should ask for PIN-code login, when logged in with OIDC provider', async () => {
    const initFn = () => {
      userSession.loginReturnStatus = 401;
      userSession.loginReturnCode = { code: 'PINCODE_REQUIRED' };
    };

    await init(initFn);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(location.path()).toBe('/pincode_login');
  });

  it('should redirect browser to OIDC provider, when requested by user', async () => {
    await init();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.oidcSignIn).toBeTruthy();

    const currentLocation = globalThis.location.href;
    component.sendOIDCAuthRequest();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(currentLocation).not.toEqual(globalThis.location.href);
    expect(globalThis.location.href).toMatch(/.*\/authorize/);
  });

  it('should disable the possibility for change password', async () => {
    const initFn = () => {
      expect(authentication.canChangePassword).toBe(true);
    };
    await init(initFn);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(authentication.canChangePassword).toBe(false);
  });

  it('should add additionalParams as query params to auth request', async () => {
    await init();
    fixture.detectChanges();
    await fixture.whenStable();

    component.sendOIDCAuthRequest();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(globalThis.location.href).toMatch(/.*&foo=bar&baz=42/);
  });
});
