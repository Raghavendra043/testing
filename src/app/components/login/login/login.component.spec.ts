import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FakeAuthenticationService } from 'src/app/mocks/authentication-service.mock';
import { FakeIdle } from 'src/app/mocks/idle.mock';
import { FakeClientLoggingService } from 'src/app/mocks/client-logging-service.mock';
import { FakeClinicianService } from 'src/app/mocks/clinician-service.mock';
import { FakeNotificationsService } from 'src/app/mocks/notifications-service.mock';
import { FakePatientService } from 'src/app/mocks/patient-service.mock';
import { FakeServerInfoService } from 'src/app/mocks/server-info-service.mock';
import { FakeVideoService } from 'src/app/mocks/video-service.mock';
import { AuthenticationService } from 'src/app/services/rest-api-services/authentication.service';
import { ClinicianService } from 'src/app/services/rest-api-services/clinician.service';
import { ClientLoggingService } from 'src/app/services/state-services/client-logging.service';
import { Idle } from '@ng-idle/core';
import { NotificationsService } from 'src/app/services/rest-api-services/notifications.service';
import { PatientService } from 'src/app/services/rest-api-services/patient.service';
import { ServerInfoService } from 'src/app/services/rest-api-services/server-info.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { UserSessionService } from 'src/app/services/state-services/user-session.service';
import { VideoService } from 'src/app/services/video-services/video.service';
import { HeaderModule } from '../../header/header.module';
import { MenuComponent } from '../../menu/menu/menu.component';
import { LoginComponent } from './login.component';
import { ConfigService } from '@services/state-services/config.service';
import { FakeConfigService } from '@app/mocks/config-service.mock';
import { of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let location: Location;

  let authService: any;
  let stateService: any;
  let serverInfoService: any;
  let patientService: any;
  let videoService: any;
  let notificationsService: any;
  let clientLoggingService: any;
  let clinicianService: any;
  let configService: any;
  let jwtHelper = new JwtHelperService();

  const validToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWRpdCI6IjhlNTI3Yzk2LTZiYWEt' +
    'NDkxNy04M2M5LTIwNDZkYmVhNGFkYyIsImlhdCI6MTY2NTA2NjcwNSwiaXNzIjoiaHR0c' +
    'HM6Ly9vdGgtZGVtby5vdGguaW8vaWRwMi8iLCJqdGkiOiJodHRwczovL290aC1kZW1vLm' +
    '90aC5pby9pZHAyL3Rva2Vucy83MjY4NyIsIm5hbWUiOiJOYW5jeSBBbm4gRG9lIiwicGV' +
    'ybSI6WyJyZWFkOiByZXN1bHRzIiwicmVhZDogb3duIG1lc3NhZ2UtdGhyZWFkcyIsInJl' +
    'YWQ6IG93biBhY2tub3dsZWRnZW1lbnRzIiwicmVhZDogb3duIHBhdGllbnQtdGhyZXNob' +
    '2xkcyIsIndyaXRlOiBwaW5jb2RlIiwid3JpdGU6IG93biBkZXZpY2VzIiwicmVhZDogb3' +
    'duIGRldmljZXMiLCJkZWxldGU6IG93biBkZXZpY2VzIiwiUk9MRV9RVUVTVElPTk5BSVJ' +
    'FX1NDSEVEVUxFX1JFQURfT1dOIiwicmVhZDogb3duIHF1ZXN0aW9ubmFpcmVzIiwid3Jp' +
    'dGU6IG93biBtZXNzYWdlLXRocmVhZHMiLCJ3cml0ZTogY2hhdCBtZXNzYWdlcyIsInJlY' +
    'WQ6IGNoYXQgbWVzc2FnZXMiLCJ3cml0ZTogYXR0YWNobWVudHMiLCJyZWFkOiBhdHRhY2' +
    'htZW50cyIsIndyaXRlOiBvd24gbWVhc3VyZW1lbnQtc3RyZWFtcyIsInJlYWQ6IG93biB' +
    'tZWFzdXJlbWVudC1zdHJlYW1zIiwid3JpdGU6IG93biBjb250YWN0LWluZm9ybWF0aW9u' +
    'Iiwid3JpdGU6IG93biBxdWVzdGlvbm5haXJlLXJlc3VsdHMiLCJST0xFX01PTklUT1JJT' +
    'kdfUExBTl9SRUFEX09XTiIsInJlYWQ6IGNhdGVnb3JpZXMiLCJST0xFX1JFQURfSEVMUF' +
    '9URVhUUyIsInJlYWQ6IG93biBpbmRpdmlkdWFsLXNlc3Npb24tbWVzc2FnZXMiLCJ3cml' +
    '0ZTogZW50cmllcyIsIndyaXRlOiBjb250aW51b3VzLWN0ZyIsIlJPTEVfV0VCX0xPR0lO' +
    'IiwiUk9MRV9RVUVTVElPTk5BSVJFX1JFQURfQUxMIiwiUk9MRV9RVUVTVElPTk5BSVJFX' +
    '0RPV05MT0FEIiwiUk9MRV9QQVRJRU5UX0xPR0lOIiwicmVhZDogb3duIGV2ZW50cyIsIn' +
    'JlYWQ6IG93biBpbmRpdmlkdWFsLXNlc3Npb25zIiwicmVhZDogb3duIG1lZXRpbmctbWV' +
    'zc2FnZXMiLCJ3cml0ZTogb3duIG1lYXN1cmVtZW50LWNhcHR1cmVzIiwicmVhZDogb3du' +
    'IG1lYXN1cmVtZW50LWNhcHR1cmVzIiwicmVhZDogY2FsY3VsYXRpb24iLCJ3cml0ZTogb' +
    '3duIG1lZXRpbmctc3RhdHVzIiwid3JpdGU6IG93biBtZWV0aW5nLW1lc3NhZ2VzIiwid3' +
    'JpdGU6IG93biBpbmRpdmlkdWFsLXNlc3Npb24tcGFydGljaXBhbnQiLCJ3cml0ZTogb3d' +
    'uIGluZGl2aWR1YWwtc2Vzc2lvbi1tZXNzYWdlcyIsInJlYWQ6IG93biBtZWV0aW5ncyIs' +
    'InJlYWQ6IGNsaWVudC1jaXRpemVuIl0sInB3ZXhwaXJlcyI6IjMwMjEtMTItMjRUMDU6M' +
    'zc6MTQuMDAwMDAwWiIsInN0eSI6InVzZXIiLCJzdWIiOiJodHRwczovL290aC1kZW1vLm' +
    '90aC5pby9pZHAyL3VzZXJzLzIzIiwidXJpIjoiaHR0cHM6Ly9vdGgtZGVtby5vdGguaW8' +
    'vY2xpbmljaWFuL2FwaS9wYXRpZW50cy8xMyIsInVzZXJuYW1lIjoiTmFuY3lBbm4iLCJ1' +
    'dHkiOiJwYXRpZW50In0.c4LvXVBptYu6ZtDO5dJ9mdMN6fOletzVmBYP8LrlKrZgljQ_q' +
    '7r_IAb9SALABwfKtdtEAPAUtPlaQAeVOK7fa6iH42GJ44bf_f4HbQXpOua4fMstbPj7Tw' +
    'ruTjLxXaNPf_KCvuDoJ6e1ZtOuAMWV6oS-ouWaR9eDrKbupTmKvOL97c6Eti7k3nhIp8b' +
    'V0K-xLTGSrDQ-b5ideK0T3JrPm_u0fLWTDHdm2GKKNoueAnOKdoWGDONNyRI5r3C2F5rl' +
    'UgKrvB1e7mrYBv63mwnT5Ynyeezw2i0H4icWlU3EJ2D3l_9DGsCoont6OWmlYdMF2L86J9k74VaMNnQAZZfNYw';

  let errorObj: any = undefined;
  const clearCurrentAuthTokenCalled = false;
  let useSilentLogin = false;
  const logoutCalled = false;
  const clientLoggingEnableCalled = false;

  const beforeEachAsyncFn = async () => {
    authService = new FakeAuthenticationService(
      errorObj,
      clearCurrentAuthTokenCalled,
      useSilentLogin,
      logoutCalled,
      clientLoggingEnableCalled,
      validToken
    );
    stateService = new StatePassingService(router);
    serverInfoService = new FakeServerInfoService();
    patientService = new FakePatientService();
    videoService = new FakeVideoService();
    notificationsService = new FakeNotificationsService();
    clientLoggingService = new FakeClientLoggingService();
    clinicianService = new FakeClinicianService(false);
    configService = new FakeConfigService();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent, MenuComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'login',
            component: LoginComponent,
          },
          {
            path: 'menu',
            component: MenuComponent,
          },
        ]),
        HeaderModule,
        FormsModule,
      ],
      providers: [
        { provide: ConfigService, useValue: configService },
        {
          provide: AuthenticationService,
          useValue: authService,
        },
        {
          provide: StatePassingService,
          useValue: stateService,
        },
        {
          provide: PatientService,
          useValue: patientService,
        },
        {
          provide: ClientLoggingService,
          useValue: clientLoggingService,
        },
        {
          provide: ServerInfoService,
          useValue: serverInfoService,
        },
        {
          provide: NotificationsService,
          useValue: notificationsService,
        },
        {
          provide: VideoService,
          useValue: videoService,
        },
        {
          provide: ClinicianService,
          useValue: clinicianService,
        },
        {
          provide: Idle,
          useValue: new FakeIdle(),
        },
        UserSessionService,
      ],
    }).compileComponents();
  };

  async function init(fn?: any) {
    await beforeEachAsyncFn();
    router = TestBed.inject(Router);
    TestBed.inject(
      UserSessionService,
      new UserSessionService(
        authService,
        stateService,
        serverInfoService,
        patientService,
        router,
        videoService,
        notificationsService,
        clientLoggingService,
        clinicianService,
        configService
      )
    );
    location = TestBed.inject(Location);
    authService = TestBed.inject(AuthenticationService);
    fn?.();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should have a new path and have called services', async () => {
    errorObj = undefined;
    await init();
    component.model = {
      showPopup: false,
      showLoginForm: true,
      username: 'nancyann',
      password: 'abcd1234',
      rememberMe: false,
      state: 'Initial',
    };
    const navigateSpy = spyOn(router, 'navigate');
    component.submit();

    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    // expect(clientLoggingEnableCalled).toEqual(true); //TODO: Obsolete?
    expect(navigateSpy).toHaveBeenCalledWith(['/menu']);
  });

  it('should show error message on failed login', async () => {
    const initFn = () => {
      spyOn(authService, 'login').and.callFake(() => {
        return of({
          status: 401,
          data: { code: 'BAD_CREDENTIALS' },
        });
      });
    };
    await init(initFn);
    component.model = {
      showPopup: false,
      showLoginForm: true,
      rememberMe: false,
      username: 'nancyann',
      password: 'abcd1234',
      state: 'Initial',
    };

    component.submit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.model.error).toEqual('BAD_CREDENTIALS');
    expect(component.model.username).toBe('nancyann');
    expect(component.model.password).toBe(undefined);
  });

  it('should show error message when account is locked', async () => {
    const initFn = () => {
      spyOn(authService, 'login').and.callFake(() => {
        return of({
          status: 401,
          data: { code: 'ACCOUNT_LOCKED' },
        });
      });
    };
    await init(initFn);
    component.model = {
      showPopup: false,
      showLoginForm: true,
      rememberMe: false,
      username: 'nancyann',
      password: 'abcd1234',
      state: 'Initial',
    };
    component.submit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.model.error).toEqual('ACCOUNT_LOCKED');
  });

  it('should show error message when account is no longer active', async () => {
    const initFn = () => {
      spyOn(authService, 'login').and.callFake(() => {
        return of({
          status: 401,
          data: { code: 'USER_INACTIVE' },
        });
      });
    };
    await init(initFn);
    component.model = {
      showPopup: false,
      showLoginForm: true,
      rememberMe: false,
      username: 'nancyann',
      password: 'abcd1234',
      state: 'Initial',
    };
    component.submit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.model.error).toEqual('USER_INACTIVE');
  });

  it('should show server unavailable error message on unknown login error', async () => {
    const initFn = () => {
      spyOn(authService, 'login').and.callFake(() => {
        return of({
          status: 500,
          data: { code: 'UNKNOWN' },
        });
      });
    };
    await init(initFn);

    component.model = {
      showPopup: false,
      showLoginForm: true,
      rememberMe: false,
      username: 'nancyann',
      password: 'abcd1234',
      state: 'Initial',
    };
    component.submit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.model.error).toEqual('OPENTELE_DOWN_TEXT');
  });

  it('should show logged out error message when redirected to from other location', async () => {
    const authError = () => {
      stateService.requestParams.set('authenticationError', 'LOGGED_OUT');
    };
    await init(authError);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.model.error).toEqual('LOGGED_OUT');
  });

  it('should show error message instead of login form when server is unreachable', async () => {
    const serverError = () => {
      serverInfoService.shouldReject = true;
    };
    await init(serverError);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.model.showLoginForm).toBe(false);
    expect(component.model.error).toMatch('OPENTELE_UNAVAILABLE_TEXT');
  });

  it('should clear current user state when navigating to login page', async () => {
    useSilentLogin = false;
    const setUser = () => {
      spyOn(authService, 'clearCurrentAuthToken');
      stateService.currentUser.set({
        firstName: 'foo',
        lastName: 'bar',
      });
    };
    await init(setUser);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(authService.clearCurrentAuthToken).toHaveBeenCalled();
    expect(stateService.currentUser.get()).toEqual(undefined);
  });

  it('should pass remember me flag to login service', async () => {
    const initFn = () => {
      spyOn(authService, 'login').and.returnValue(
        of({
          claims: jwtHelper.decodeToken(validToken),
          canChangePassword: true,
          logoutUrl: 'http://localhost/log-me-out',
        })
      );
    };
    errorObj = undefined;
    await init(initFn);

    component.model = {
      showPopup: false,
      showLoginForm: true,
      rememberMe: true,
      username: 'nancyann',
      password: 'abcd1234',
      state: 'Initial',
    };
    component.submit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(authService.login).toHaveBeenCalled();
    const args = authService.login.calls.argsFor(0);
    const rememberMe = args[2];
    expect(rememberMe).toBe(true);
  });

  describe('skip login dialog', () => {
    it('should skip login form when silent login succeeds', async () => {
      errorObj = undefined;
      useSilentLogin = true;

      await init();
      fixture.detectChanges();
      await fixture.whenStable();
      await fixture.whenRenderingDone();

      expect(component.model.showLoginForm).toBe(false);
      expect(location.path()).toEqual('/menu');
    });
  });
});
