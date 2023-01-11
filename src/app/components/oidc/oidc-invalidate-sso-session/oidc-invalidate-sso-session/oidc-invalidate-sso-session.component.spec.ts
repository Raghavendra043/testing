import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OidcUtilsService } from '@services/oidc-services/oidc-utils.service';
import { OIDC_CONTINUE_WITH_ID } from '@utils/globals';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, of } from 'rxjs';
import { OidcInvalidateSsoSessionComponent } from './oidc-invalidate-sso-session.component';

class FakeOidcSecurityService {
  getIdToken(): Observable<string> {
    return of('continueWithIdToken');
  }
}
class FakeOidcUtilsService {
  sendLogoutRequest() {
    const logoutUrl =
      'https://demo.identityserver.io/connect/endsession' +
      '?post_logout_redirect_uri=' +
      'http://localhost:8000/client-citizen/';
    globalThis.location.replace(logoutUrl);
  }

  invalidateSsoSession() {
    this.sendLogoutRequest();
  }
}

describe('OidcInvalidateSsoSessionComponent', () => {
  let component: OidcInvalidateSsoSessionComponent;
  let fixture: ComponentFixture<OidcInvalidateSsoSessionComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    //@ts-ignore
    globalThis = {
      location: {
        href: 'http://www.default.com',
        replace: function (url: any) {
          this.href = url;
        },
      },
    };
    await TestBed.configureTestingModule({
      declarations: [OidcInvalidateSsoSessionComponent],
      providers: [
        {
          provide: OidcSecurityService,
          useValue: new FakeOidcSecurityService(),
        },
        {
          provide: OidcUtilsService,
          useValue: new FakeOidcUtilsService(),
        },
      ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(OidcInvalidateSsoSessionComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate SSO session by sending logout request to OP', function () {
    expect(globalThis.location.href).toContain(
      'https://demo.identityserver.io/connect/endsession'
    );
  });

  it('should store id token for usage when the login flow continues after SSO session invalidation', function () {
    expect(OIDC_CONTINUE_WITH_ID.get()).toBe('continueWithIdToken');
  });
});
