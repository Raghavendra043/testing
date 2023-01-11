import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { validUser } from '@app/mocks/user.mock';
import { User } from '@app/types/user.type';
import { Utils } from '@services/util-services/util.service';
import {
  AUTO_LOGIN_TOKEN,
  BYPASS_CUSTOM_CLAIMS_KEY,
  BYPASS_TOKEN_KEY,
  REFRESH_TOKEN,
} from '@utils/globals';
import { of } from 'rxjs';
import { StatePassingService } from '../state-services/state-passing.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let router: Router;
  let service: AuthenticationService;
  let utils: Utils;
  let appContext: StatePassingService;
  let httpClient: HttpClient;
  let httpTestingControlller: HttpTestingController;

  const loginUrl = 'http://localhost/auth';
  const validToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VybmFtZSI6Im5hbmN5YW5uIiwic' +
    '3ViIjoiaHR0cDovL2xvY2FsaG9zdDo4MTQwL3VzZXJzLzEiLCJzdHkiOiJ1c2VyIiwicm9' +
    'sZXMiOlsiUGF0aWVudCJdLCJwd2V4cGlyZWQiOmZhbHNlLCJwZXJtIjpbInJlYWQ6IG93b' +
    'iBldmVudHMiLCJST0xFX0NPTVBMRVRFRF9RVUVTVElPTk5BSVJFX1JFQUQiLCJST0xFX0N' +
    'PTVBMRVRFRF9RVUVTVElPTk5BSVJFX1JFQURfQUxMIiwiUk9MRV9KT0lOX1ZJREVPX0NBT' +
    'EwiLCJST0xFX01FU1NBR0VfUkVBRCIsIlJPTEVfTUVTU0FHRV9XUklURSIsIlJPTEVfUEF' +
    'USUVOVF9MT0dJTiIsIlJPTEVfUEFUSUVOVF9RVUVTVElPTk5BSVJFX1JFQURfQUxMIiwiU' +
    'k9MRV9QQVRJRU5UX1FVRVNUSU9OTkFJUkVfV1JJVEUiLCJST0xFX1FVRVNUSU9OTkFJUkV' +
    'fQUNLTk9XTEVER0VEX1JFQUQiLCJST0xFX1FVRVNUSU9OTkFJUkVfRE9XTkxPQUQiLCJST' +
    '0xFX1FVRVNUSU9OTkFJUkVfUkVBRF9BTEwiLCJST0xFX1FVRVNUSU9OTkFJUkVfVVBMT0F' +
    'EIiwiUk9MRV9SRUFMVElNRV9DVEdfU0FWRSIsIlJPTEVfV0VCX0xPR0lOIiwicmVhZDogY' +
    '2FsY3VsYXRpb24iXSwibmFtZSI6Ik5hbmN5IEFubiBEb2UiLCJqdGkiOiJodHRwOi8vbG9' +
    'jYWxob3N0OjgxNDAvdG9rZW5zLzEiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgxNDAvd' +
    'XNlcnMvYXV0aCIsImlhdCI6MTUwMTQ5NjExOSwiYXVkaXQiOiIyNTJmNWY3OC03NWQ5LTE' +
    'xZTctYmU5YS04MGU2NTAxNDUyOGMifQ.nW5LPXT271OH_zbpkLWbjvI6JNrfhPzDXF6iDl' +
    'oRSzSoSCAuoq7DDnyBfHPavIsYWGqmTPNxdXwJOlY9SOR_vJgQ8b8NAJWyZnPS6cOcBZZ1' +
    '0vp9xJsOS5R9hbH2YEOzV6GP3RUi7Xcby6T7rgKHb470vu9F9KcB9UADC6XhsHhBjL4g9W' +
    'w9NBW0bbAwfcGGrpKU-GAUpg6SLe5GRxSp8xq1nslF4SPgoxZ8ykyj_d1Rx2In2vVzS6qo' +
    'Ab9c7Qxag277PpJVJYZuXce_UFUTdAD3b_tCfQBouMBxtIKDi5owCh7vxXN-AZZNUXHUVNZwWKpuN3GhJD9pytnbXq-uDw';

  const validLoginResponse: any = {
    type: 'Bearer',
    token: validToken,
    customClaims: {
      organizations: [],
      patientGroups: [],
    },
    links: {
      logout: 'http://localhost/idp2/tokens/2',
    },
    refreshToken: 'some-refresh-token',
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
  });

  beforeEach(() => {
    appContext = new StatePassingService(router);
    utils = new Utils();
    httpTestingControlller = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    service = new AuthenticationService(appContext, httpClient, utils);
  });

  describe('login with OIDC id token tests', () => {
    const oidcLoginUrl = 'http://localhost/idp2/oidc/auth';

    it('should invoke success callback when response is valid', () => {
      const callbackSuccess: boolean[] = [];

      service
        .oidcLogin(oidcLoginUrl, 'some-id-token')
        .subscribe((response: any) => {
          if (service.isJWT(response)) {
            callbackSuccess.push(true);
          } else {
            callbackSuccess.push(false);
          }
        });
      httpTestingControlller.expectOne(oidcLoginUrl).flush(validLoginResponse);
      expect(callbackSuccess).toEqual([true]);
    });

    it('should invoke error callback when response is an error', () => {
      const calbacks: boolean[] = [];

      service.oidcLogin(oidcLoginUrl, 'some-id-token').subscribe(
        (response) => {
          calbacks.push(true);
        },
        (err) => {
          calbacks.push(false);
          const status = err.status;
          const data = err.data;
          expect(status).toEqual(401);
          expect(data).toEqual({ code: 'BAD_CREDENTIALS' });
        }
      );

      httpTestingControlller
        .expectOne(oidcLoginUrl)
        .flush('some invalid response', {
          status: 401,
          statusText: 'Stuff went down',
        });
      expect(calbacks).toEqual([false]);
    });

    it('should transform response to client object', () => {
      const calbacks: boolean[] = [];
      let claims: any, canChangePw: any, url: any;

      service
        .oidcLogin(oidcLoginUrl, 'some-id-token')
        .subscribe((response: any) => {
          if (service.isJWT(response)) {
            calbacks.push(true);
            claims = response.claims;
            canChangePw = response.canChangePassword;
            url = response.logoutUrl;
          } else {
            calbacks.push(false);
          }
        });

      httpTestingControlller.expectOne(oidcLoginUrl).flush(validLoginResponse);

      assertValidResponseClaims(claims);
      expect(canChangePw).toBe(false);
      expect(url).toEqual(validLoginResponse.links.logout);
    });

    it('should store refresh token credentials in local storage when login succeeds', fakeAsync(() => {
      service.oidcLogin(oidcLoginUrl, 'some-id-token').subscribe(() => {});
      httpTestingControlller.expectOne(oidcLoginUrl).flush(validLoginResponse);
      tick();
      const stored = AUTO_LOGIN_TOKEN.get();
      expect(stored).toEqual('some-refresh-token');
    }));
  });

  describe('pin code login tests', () => {
    it('should add pin code to headers and call login', fakeAsync(() => {
      spyOn(service, 'trySilentLogin').and.returnValue(
        //@ts-ignore
        of({
          'Authorization-MFA': 'pincode=1234',
        })
      );

      const onSuccess = () => {};
      const onError = () => {};
      service.pinCodeLogin(loginUrl, '1234').then(onSuccess, onError);

      const expectedHeaders = {
        'Authorization-MFA': 'pincode=1234',
      };
      tick();

      expect(service.trySilentLogin).toHaveBeenCalledWith(
        loginUrl,
        expectedHeaders
      );
    }));
  });

  describe('set pincode tests', () => {
    const setPinCodeUrl = 'http://localhost/idp2/mfa/pincode';

    it('should be possible to set a pin code to use as part of mfa auth', fakeAsync(() => {
      let successCallbackInvoked = false;
      let errorCallbackInvoked = false;

      const pinCode = '1234';
      service.setPinCode(setPinCodeUrl, pinCode).then(
        () => {
          successCallbackInvoked = true;
        },
        () => {
          errorCallbackInvoked = true;
        }
      );
      httpTestingControlller
        .expectOne(setPinCodeUrl)
        .flush({ status: 200, statusText: 'OK' });

      tick();
      expect(errorCallbackInvoked).toBe(false);
      expect(successCallbackInvoked).toBe(true);
    }));

    it('should invoke error callback if set pin code request fails', fakeAsync(() => {
      let successCallbackInvoked = false;
      let errorCallbackInvoked = false;

      const pinCode = '1234';
      service.setPinCode(setPinCodeUrl, pinCode).then(
        () => {
          successCallbackInvoked = true;
        },
        () => {
          errorCallbackInvoked = true;
        }
      );
      httpTestingControlller
        .expectOne(setPinCodeUrl)
        .flush('some error', { status: 400, statusText: 'Ooops...' });
      tick();

      expect(errorCallbackInvoked).toBe(true);
      expect(successCallbackInvoked).toBe(false);
    }));
  });

  describe('login', () => {
    it('should invoke error callback when status is 401', () => {
      const callbackSuccess: boolean[] = [];

      service
        .login(loginUrl, { username: 'user', password: 'password' }, false)
        .subscribe((response) => {
          if (service.isJWT(response)) {
            callbackSuccess.push(true);
          } else {
            const statusCode = response.status;
            const reason = response.data;
            callbackSuccess.push(false);
            expect(statusCode).toEqual(401);
            expect(reason).toEqual({ code: 'BAD_CREDENTIALS' });
          }
        });

      httpTestingControlller.expectOne(loginUrl).flush(
        {
          errors: [{ field: 'authorization', error: 'invalid' }],
        },
        {
          status: 401,
          statusText: 'invalid',
        }
      );

      expect(callbackSuccess).toEqual([false]);
    });

    it('should invoke error callback with proper reason when account is locked', () => {
      const callbackSuccess: boolean[] = [];

      service
        .login(loginUrl, { username: 'user', password: 'password' }, false)
        .subscribe((response) => {
          if (service.isJWT(response)) {
            callbackSuccess.push(true);
          } else {
            const reason = response.data;
            callbackSuccess.push(false);
            expect(reason).toEqual({ code: 'ACCOUNT_LOCKED' });
          }
        });

      httpTestingControlller.expectOne(loginUrl).flush(
        {
          errors: [{ field: 'authorization', error: 'locked' }],
        },
        {
          status: 401,
          statusText: 'authorization locked',
        }
      );

      expect(callbackSuccess).toEqual([false]);
    });

    it('should invoke error callback on non-401 errors', () => {
      const callbackSuccess: boolean[] = [];

      service
        .login(loginUrl, { username: 'user', password: 'password' }, false)
        .subscribe((response) => {
          if (service.isJWT(response)) {
            callbackSuccess.push(true);
          } else {
            const reason = response.data;
            const statusCode = response.status;
            callbackSuccess.push(false);
            expect(statusCode).toEqual(500);
            expect(reason).toEqual({ code: 'UNKNOWN' });
          }
        });

      httpTestingControlller.expectOne(loginUrl).flush(
        {},
        {
          status: 500,
          statusText: 'Internal error',
        }
      );

      expect(callbackSuccess).toEqual([false]);
    });

    it('should invoke success callback when response is valid', () => {
      const callbackSuccess: boolean[] = [];

      service
        .login(loginUrl, { username: 'user', password: 'password' }, false)
        .subscribe((response) => {
          if (service.isJWT(response)) {
            callbackSuccess.push(true);
          } else {
            callbackSuccess.push(false);
          }
        });
      httpTestingControlller.expectOne(loginUrl).flush(validLoginResponse);

      expect(callbackSuccess).toEqual([true]);
    });

    it('should transform response to client object', () => {
      const callbackSuccess: boolean[] = [];

      let claims: any, canChangePw: any, url;

      service
        .login(loginUrl, { username: 'user', password: 'secret' }, false)
        .subscribe((response) => {
          if (service.isJWT(response)) {
            callbackSuccess.push(true);
            claims = response.claims;
            canChangePw = response.canChangePassword;
            url = response.logoutUrl;
          } else {
            callbackSuccess.push(false);
          }
        });
      httpTestingControlller.expectOne(loginUrl).flush(validLoginResponse);

      expect(callbackSuccess).toEqual([true]);

      assertValidResponseClaims(claims);
      expect(canChangePw).toEqual(true);
      expect(url).toEqual(validLoginResponse.links.logout);
    });

    it('should store refresh token credentials in local storage when remember me is checked', () => {
      const rememberMe = true;
      service
        .login(loginUrl, { username: 'user', password: 'password' }, rememberMe)
        .subscribe({});
      httpTestingControlller.expectOne(loginUrl).flush(validLoginResponse);

      const stored = AUTO_LOGIN_TOKEN.get();
      expect(stored).toEqual('some-refresh-token');
    });

    it('should pass on custom headers to auth endpoint if set', () => {
      const customHeaders = {
        'Authorization-MFA': 'pincode=1234',
      };

      const callbackSuccess: boolean[] = [];

      service
        .login(
          loginUrl,
          { token: 'some-refresh-token', type: 'Refresh' },
          true,
          customHeaders
        )
        .subscribe((response) => {
          if (service.isJWT(response)) {
            callbackSuccess.push(true);
          } else {
            callbackSuccess.push(false);
          }
        });
      httpTestingControlller.expectOne(loginUrl).flush(validLoginResponse);

      expect(callbackSuccess).toEqual([true]);
    });
  });

  describe('silent login', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    it('should invoke success callback when logged in using bypass login screen feature', () => {
      const customClaims = {
        organizations: [{ name: 'fancy org' }],
      };

      const callbackSuccess: boolean[] = [];

      BYPASS_TOKEN_KEY.set(validToken);
      BYPASS_CUSTOM_CLAIMS_KEY.set(JSON.stringify(customClaims));
      service.trySilentLogin('auth_url').subscribe((response) => {
        if (service.isJWT(response)) {
          callbackSuccess.push(true);
          const claims = response.claims;
          const canChangePw = response.canChangePassword;
          expect(canChangePw).toEqual(false);
          assertValidResponseClaims(claims);
        } else {
          callbackSuccess.push(false);
        }
      });

      httpTestingControlller.expectNone(loginUrl);

      expect(callbackSuccess).toEqual([true]);
    });

    it('should invoke success callback when logging in using refresh token', () => {
      const callbackSuccess: boolean[] = [];

      REFRESH_TOKEN.set('foobar');

      service.trySilentLogin(loginUrl).subscribe((response) => {
        if (service.isJWT(response)) {
          callbackSuccess.push(true);
          const claims = response.claims;
          const canChangePw = response.canChangePassword;
          const logoutUrl = response.logoutUrl;
          expect(claims).toBeDefined();
          expect(claims['iss']).toBeDefined();
          expect(canChangePw).toEqual(true);
          expect(logoutUrl).toEqual(validLoginResponse.links.logout);
        } else {
          callbackSuccess.push(false);
        }
      });

      httpTestingControlller.expectOne(loginUrl).flush(validLoginResponse);

      expect(callbackSuccess).toEqual([true]);
    });

    it('should invoke error callback and have removed failing refresh token when refresh token login fails', () => {
      REFRESH_TOKEN.set('foobar');

      const errorCalled: boolean[] = [];

      service.trySilentLogin(loginUrl).subscribe((response) => {
        if (service.isJWT(response)) {
          errorCalled.push(false);
        } else {
          errorCalled.push(true);
          expect(REFRESH_TOKEN.get()).toBeNull();
        }
      });

      httpTestingControlller
        .expectOne(loginUrl)
        .flush({}, { status: 401, statusText: 'Error' });

      expect(errorCalled).toEqual([true]);
    });

    it('should invoke success callback when logging in using auto login', () => {
      AUTO_LOGIN_TOKEN.set('foobar');
      const callbackSuccess: boolean[] = [];

      service.trySilentLogin(loginUrl).subscribe((response) => {
        if (service.isJWT(response)) {
          const claims = response.claims;
          const canChangePw = response.canChangePassword;
          const logoutUrl = response.logoutUrl;
          expect(claims).toBeDefined();
          expect(claims.iss).toBeDefined();
          expect(canChangePw).toEqual(true);
          expect(logoutUrl).toEqual(validLoginResponse.links.logout);
          callbackSuccess.push(true);
        } else {
          callbackSuccess.push(false);
          fail('Error callback should not be invoked');
        }
      });
      httpTestingControlller.expectOne(loginUrl).flush(validLoginResponse);

      expect(callbackSuccess).toEqual([true]);
    });

    it('should invoke error callback and have removed failing refresh login token when auto login fails', () => {
      AUTO_LOGIN_TOKEN.set('foobar');

      const callbackSuccess: boolean[] = [];
      service.trySilentLogin(loginUrl).subscribe((response) => {
        if (service.isJWT(response)) {
          callbackSuccess.push(true);
          fail('Success callback should not be invoked');
        } else {
          callbackSuccess.push(false);
          expect(AUTO_LOGIN_TOKEN.get()).toBeNull();
        }
      });

      httpTestingControlller.expectOne(loginUrl).flush(
        { errors: [{ error: '', field: '' }] },
        {
          status: 401,
          statusText: '',
        }
      );

      expect(callbackSuccess).toEqual([false]);
    });

    it('should invoke success callback when logging in using refresh token', () => {
      REFRESH_TOKEN.set('foobar');

      const callbackSuccess: boolean[] = [];

      service.trySilentLogin(loginUrl).subscribe((response) => {
        if (service.isJWT(response)) {
          const claims = response.claims;
          const canChangePw = response.canChangePassword;
          const logoutUrl = response.logoutUrl;
          expect(claims).toBeDefined();
          expect(claims.iss).toBeDefined();
          expect(canChangePw).toEqual(true);
          expect(logoutUrl).toEqual(validLoginResponse.links.logout);
          callbackSuccess.push(true);
        } else {
          callbackSuccess.push(false);
          fail('Error callback should not be invoked');
        }
      });

      httpTestingControlller.expectOne(loginUrl).flush(validLoginResponse);

      expect(callbackSuccess).toEqual([true]);
    });

    it('should pass on custom headers to auth endpoint if set', () => {
      const callbackSuccess: boolean[] = [];
      const customHeaders = {
        'Authorization-MFA': 'pincode=1234',
      };
      REFRESH_TOKEN.set('foobar');

      service.trySilentLogin(loginUrl, customHeaders).subscribe((response) => {
        if (service.isJWT(response)) {
          callbackSuccess.push(true);
        } else {
          callbackSuccess.push(false);
        }
      });

      const req = httpTestingControlller.expectOne(loginUrl);
      expect(req.request.headers.get('Authorization-MFA'))
        .withContext(JSON.stringify(req.request.headers))
        .toBe('pincode=1234');
      req.flush(validLoginResponse);

      expect(callbackSuccess).toEqual([true]);
    });
  });

  describe('logout tests', () => {
    it('should be possible to logout', () => {
      service
        .login(loginUrl, { username: 'user', password: 'pw' }, false)
        .subscribe();

      httpTestingControlller.expectOne(loginUrl).flush(validLoginResponse);

      expect(
        appContext.requestParams.get('authorizationHeader') as string
      ).toMatch(/Bearer/);

      const user: User = {
        ...validUser,
        links: { ...validUser.links },
      };

      const logoutUrl = user.links.logout;

      service.logout(user).subscribe({
        next: () => {
          expect(
            appContext.requestParams.get('authorizationHeader') as string
          ).not.toBeDefined();
        },
      });

      httpTestingControlller
        .expectOne(logoutUrl)
        .flush({}, { status: 204, statusText: 'No content' });
    });

    it('should not throw error if not logged in', () => {
      expect(
        appContext.requestParams.get('authorizationHeader') as string
      ).toBeUndefined();

      const user: User = {
        ...validUser,
        links: { ...validUser.links },
      };
      const callbackSuccess: boolean[] = [];

      service.logout(user).subscribe({
        next: () => {
          callbackSuccess.push(true);
          expect(
            appContext.requestParams.get('authorizationHeader') as string
          ).not.toBeDefined();
        },
        error: () => {
          callbackSuccess.push(false);
        },
      });
      httpTestingControlller
        .expectOne(user.links.logout)
        .flush(validLoginResponse);

      expect(callbackSuccess).toEqual([true]);
    });

    it('should not fail if remote logout request fails', () => {
      const callbackSuccess: boolean[] = [];

      service
        .login(loginUrl, { username: 'user', password: 'pw' }, false)
        .subscribe();

      httpTestingControlller.expectOne(loginUrl).flush(validLoginResponse);

      expect(
        appContext.requestParams.get('authorizationHeader') as string
      ).toMatch(/Bearer/);

      const user: User = {
        ...validUser,
        links: { ...validUser.links },
      };

      service.logout(user).subscribe({
        next: () => {
          callbackSuccess.push(true);
        },
        error: () => {
          callbackSuccess.push(false);
          expect(
            appContext.requestParams.get('authorizationHeader') as string
          ).not.toBeDefined();
        },
      });

      const req = httpTestingControlller.expectOne(user.links.logout);
      expect(req.request.method.toLowerCase()).toBe('delete');
      req.flush({}, { status: 404, statusText: 'Not found' });

      expect(callbackSuccess).toEqual([false]);
    });
  });

  describe('change password tests', () => {
    const changePasswordUrl = 'http://localhost/idp2/users/auth';

    it('should invoke success callback when password changed', () => {
      const callbackSuccess: boolean[] = [];

      service
        .changePassword('nancyann', changePasswordUrl, '321', '123')
        .subscribe({
          next: () => {
            callbackSuccess.push(true);
          },
          error: () => {
            callbackSuccess.push(false);
          },
        });

      const req = httpTestingControlller.expectOne(changePasswordUrl);
      expect(req.request.method.toLowerCase()).toBe('post');
      req.flush(validLoginResponse);

      expect(callbackSuccess).toEqual([true]);
    });

    it('should format correct request', () => {
      let requestData = {};

      service
        .changePassword('nancyann', changePasswordUrl, '321', '123')
        .subscribe();

      const req = httpTestingControlller.expectOne(changePasswordUrl);
      expect(req.request.method.toLowerCase()).toBe('post');
      requestData = req.request.body;
      req.flush(validLoginResponse);

      expect(requestData).toEqual({
        password: '123',
      });
    });

    it('should transform error body to proper error status code', fakeAsync(() => {
      let actualErrors: any = [];
      let actualStatus = 0;
      let successCalled = false;
      let errorCalled = false;
      service
        .changePassword('nancyann', changePasswordUrl, '321', '123')
        .subscribe({
          next: () => {
            successCalled = true;
          },
          error: (response: any) => {
            errorCalled = true;
            const error = response.error;
            actualStatus = response.status;
            actualErrors = error.errors.map((e: any) => {
              return e.error;
            });
          },
        });

      const req = httpTestingControlller.expectOne(changePasswordUrl);
      expect(req.request.method.toLowerCase()).toBe('post');
      req.flush(
        {
          message: 'error',
          errors: [
            {
              error: 'at_least_8_chars',
              field: 'password',
            },
            {
              error: 'at_least_one_letter',
              field: 'password',
            },
          ],
        },
        { status: 400, statusText: 'error' }
      );

      expect(successCalled).toEqual(false);
      expect(errorCalled).toEqual(true);
      expect(actualStatus).toBe(400);
      expect(actualErrors.length).toBe(2);
      expect(actualErrors).toContain('at_least_8_chars');
      expect(actualErrors).toContain('at_least_one_letter');
    }));
  });

  const assertValidResponseClaims = (claims: any) => {
    expect(claims.pwexpired).toEqual(false);
    expect(claims.username).toEqual('nancyann');
    expect(claims.iss).toBeDefined();
    expect(claims.sub).toBeDefined();
    expect(claims.iat).toBeDefined();
    expect(claims.jti).toBeDefined();
    expect(claims.sty).toBeDefined();
    expect(claims.name).toBeDefined();
    expect(claims.perm).toBeDefined();
    expect(claims.audit).toBeDefined();
  };
});
