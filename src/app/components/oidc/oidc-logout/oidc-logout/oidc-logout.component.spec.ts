import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderModule } from '@components/header/header.module';
import { OidcStartLoginComponent } from '@components/oidc/oidc-start-login/oidc-start-login/oidc-start-login.component';
import { AuthenticationService } from '@services/rest-api-services/authentication.service';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { Utils } from '@services/util-services/util.service';

import { OidcLogoutComponent } from './oidc-logout.component';

describe('OidcLogoutComponent', () => {
  let component: OidcLogoutComponent;
  let fixture: ComponentFixture<OidcLogoutComponent>;
  let router: Router;
  let location: Location;
  let appContext: StatePassingService;
  let httpClient: HttpClient;
  let utils: Utils;
  let authentication: AuthenticationService;

  async function init(fn?: any) {
    //@ts-ignore
    globalThis = {
      location: {
        href: 'http://www.default.com',
        replace: function (url: any) {
          this.href = url;
        },
      },
      navigator: {},
      localStorage: {
        getItem: function () {
          return 'some-id-token';
        },
      },
    };

    appContext = new StatePassingService(router);
    utils = new Utils();
    authentication = new AuthenticationService(appContext, httpClient, utils);
    await TestBed.configureTestingModule({
      declarations: [OidcLogoutComponent],
      providers: [
        {
          provide: StatePassingService,
          useValue: appContext,
        },
        {
          provide: AuthenticationService,
          useValue: authentication,
        },
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: OidcStartLoginComponent },
        ]),
        HeaderModule,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    authentication = TestBed.inject(AuthenticationService);
    if (fn) {
      fn();
    }
    fixture = TestBed.createComponent(OidcLogoutComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  }

  it('should create', async () => {
    await init();
    expect(component).toBeTruthy();
  });

  it('should perform local logout (back to PIN-code login) and redirect to login page', async () => {
    const initFn = () => {
      spyOn(authentication, 'clearCurrentAuthToken');
    };
    await init(initFn);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(authentication.clearCurrentAuthToken).toHaveBeenCalled();
    expect(location.path()).toEqual('/login');
  });
});
