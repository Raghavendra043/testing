import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderModule } from '@components/header/header.module';
import { Router } from '@angular/router';
import { OidcResetLoginComponent } from './oidc-reset-login.component';
import { OidcUtilsService } from '@services/oidc-services/oidc-utils.service';
import { FakeConfigService } from '@app/mocks/config-service.mock';
import { ConfigService } from '@services/state-services/config.service';
import { HttpClient } from '@angular/common/http';

class FakeOidcUtilsService {
  sendLogoutRequest() {
    const logoutUrl =
      'https://demo.identityserver.io/connect/endsession' +
      '?post_logout_redirect_uri=' +
      'http://localhost:8000/client-citizen/';
    globalThis.location.replace(logoutUrl);
  }
}

describe('OidcResetLoginComponent', () => {
  let component: OidcResetLoginComponent;
  let fixture: ComponentFixture<OidcResetLoginComponent>;
  let router: Router;

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

    await TestBed.configureTestingModule({
      declarations: [OidcResetLoginComponent],
      providers: [
        { provide: ConfigService, useValue: new FakeConfigService() },
        {
          provide: OidcUtilsService,
          useValue: new FakeOidcUtilsService(),
        },
        HttpClient,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        HeaderModule,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    if (fn) {
      fn();
    }
    fixture = TestBed.createComponent(OidcResetLoginComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  }

  it('should create', async () => {
    await init();
    expect(component).toBeTruthy();
  });

  it('should redirect browser to OIDC provider logout url, when logging out', async () => {
    let currentLocation;
    const initFn = () => {
      currentLocation = globalThis.location.href;
    };

    await init(initFn);
    fixture.detectChanges();
    await fixture.whenStable();
    //@ts-ignore
    expect(currentLocation).not.toEqual(globalThis.location.href);
    expect(globalThis.location.href).toMatch(/.*\/endsession.*/);
    expect(globalThis.location.href).toMatch(/.*post_logout_redirect_uri=.*/);
  });
});
