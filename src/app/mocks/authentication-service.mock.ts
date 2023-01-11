import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { of, throwError } from 'rxjs';

@Injectable()
export class FakeAuthenticationService {
  private jwtHelper = new JwtHelperService();
  calledWithUsername = '';
  calledWithChangePwUrl = '';
  calledWithCurrentPassword = '';
  calledWithNewPassword = '';
  shouldFailValidation = false;

  changePassword(
    username: any,
    changePwUrl: any,
    currentPassword: any,
    newPassword: any
  ) {
    this.calledWithUsername = username;
    this.calledWithChangePwUrl = changePwUrl;
    this.calledWithCurrentPassword = currentPassword;
    this.calledWithNewPassword = newPassword;
    if (this.shouldFailValidation === true) {
      return throwError(() => ({
        data: {
          message: 'Error',
          errors: [{ error: 'at_least_8_chars' }],
        },
        status: 400,
      }));
    }
    return of({});
  }

  errorObj: any = undefined;
  clearCurrentAuthTokenCalled = false;
  useSilentLogin = false;
  logoutCalled = false;
  clientLoggingEnableCalled = false;
  validToken: any = undefined;

  constructor(
    errorObj: any,
    clearCurrentAuthTokenCalled: boolean,
    useSilentLogin: boolean,
    logoutCalled: boolean,
    clientLoggingEnableCalled: boolean,
    validToken: any
  ) {
    this.errorObj = errorObj;
    this.clearCurrentAuthTokenCalled = clearCurrentAuthTokenCalled;
    this.useSilentLogin = useSilentLogin;
    this.logoutCalled = logoutCalled;
    this.clientLoggingEnableCalled = clientLoggingEnableCalled;
    this.validToken = validToken;
  }

  login = (_patientUrl: any, _credentials: any, _rememberMe: any) => {
    if (this.errorObj === undefined) {
      return of({
        claims: this.jwtHelper.decodeToken(this.validToken),
        canChangePassword: true,
        logoutUrl: 'http://localhost/log-me-out',
      });
    } else {
      return of(() => ({
        status: this.errorObj.status,
        data: { code: this.errorObj.reason },
      }));
    }
  };

  trySilentLogin() {
    if (this.useSilentLogin === true) {
      return of({
        claims: {
          audit: 'fe42c910-2a54-4511-ae2a-1f92614ef43d',
          iat: 1665669031,
          iss: 'https://oth-devel.oth.io/idp2/',
          jti: 'https://oth-devel.oth.io/idp2/tokens/12158',
          name: 'Nancy Ann Doe',
          perm: ['read: client-citizen'],
          pwexpires: '3022-02-03T07:22:07.000000Z',
          sty: 'user',
          sub: 'https://oth-devel.oth.io/idp2/users/18',
          uri: 'https://oth-devel.oth.io/clinician/api/patients/13',
          username: 'NancyAnn',
          uty: 'patient',
        },
        organizations: [
          {
            name: 'Department of Heart Disease',
            url: 'https://oth-devel.oth.io/organizations/organizations/98223738-45e4-44a5-9317-bc032f94bc9d',
          },
        ],
        canChangePassword: true,
        logoutUrl: 'https://oth-devel.oth.io/idp2/tokens/12158',
      });
    }
    return throwError(() => -1);
  }

  logout = (_user: unknown, onSuccess: () => void) => {
    this.logoutCalled = true;
    onSuccess();
  };

  clearCurrentAuthToken() {
    this.clearCurrentAuthTokenCalled = true;
  }
}

@Injectable()
export class FakeAuthenticationService2 {
  logout() {
    return of({});
  }
}

@Injectable()
export class FakeAuthenticationService3 {
  calledWithUsername = '';
  calledWithChangePwUrl = '';
  calledWithCurrentPassword = '';
  calledWithNewPassword = '';
  shouldFailValidation = false;

  changePassword(
    username: any,
    changePwUrl: any,
    currentPassword: any,
    newPassword: any
  ) {
    this.calledWithUsername = username;
    this.calledWithChangePwUrl = changePwUrl;
    this.calledWithCurrentPassword = currentPassword;
    this.calledWithNewPassword = newPassword;
    if (this.shouldFailValidation === true) {
      return throwError(() => ({
        data: {
          message: 'Error',
          errors: [{ error: 'at_least_8_chars' }],
        },
        status: 400,
      }));
    }
    return of({});
  }
}
