import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ERROR_PASS_THROUGH } from '@app/interceptors/interceptor';
import {
  AuthResponse,
  BypassLoginCredentials,
  Credentials,
  ErrorMessage,
  ErrorResponse,
  JWT,
} from '@app/types/response.type';
import { User } from '@app/types/user.type';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { Utils } from '@services/util-services/util.service';
import {
  AUTO_LOGIN_TOKEN,
  BYPASS_CUSTOM_CLAIMS_KEY,
  BYPASS_TOKEN_KEY,
  CAN_CHANGE_PASSWORD,
  REFRESH_TOKEN,
  REMEMBER_ME,
} from '@utils/globals';
import { lastValueFrom, map, Observable, of, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private jwtHelper = new JwtHelperService();

  constructor(
    private appContext: StatePassingService,
    private http: HttpClient,
    private utils: Utils
  ) {}

  login(
    authUrl: string,
    credentials: Credentials,
    rememberMe: boolean,
    customHeaders: Record<string, string> = {}
  ): Observable<JWT | ErrorResponse> {
    REMEMBER_ME.set(rememberMe);

    const options = {
      context: new HttpContext().set(ERROR_PASS_THROUGH, true),
      withCredentials: true,
      headers: new HttpHeaders({
        ...this.buildAuthHeader(credentials),
        ...customHeaders,
      }),
    };

    return this.http.get<AuthResponse>(authUrl, options).pipe(
      tap((response) => this.updateStoredAuthDetails(response)),
      map<AuthResponse, JWT>((response) => ({
        claims: this.jwtHelper.decodeToken(response.token),
        organizations: response.customClaims.organizations,
        canChangePassword: CAN_CHANGE_PASSWORD.get(true),
        logoutUrl: response.links.logout,
      })),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          return of(this.wrapError(err));
        } else throw err;
      })
    );
  }

  trySilentLogin(
    authUrl: string,
    customHeaders: Record<string, string> = {}
  ): Observable<JWT | ErrorResponse> {
    if (this.isBypassingLoginScreen()) {
      const bypassCredentials = this.getBypassCredentials();
      this.defaultAuthHeader('Bearer ' + bypassCredentials.token);
      return of(
        this.createCredentials(
          bypassCredentials.token,
          bypassCredentials.customClaims,
          false,
          undefined
        )
      );
    }

    const refreshToken = this.tryGetRefreshToken();
    if (refreshToken !== null) {
      const credentials = {
        token: refreshToken,
        type: 'Refresh' as const,
      };

      return this.login(
        authUrl,
        credentials,
        REMEMBER_ME.get(false),
        customHeaders
      ).pipe(
        map((response) => {
          if ('claims' in response) {
            return response;
          } else {
            return this.cleanUp(response);
          }
        })
      );
    } else {
      const silentLoginNotPossible: ErrorResponse = {
        status: -1,
        data: { code: 'UNKNOWN' },
      };
      console.warn('silent login not possible', silentLoginNotPossible);
      return of(silentLoginNotPossible);
    }
  }

  pinCodeLogin(authUrl: string, pinCode: string): Promise<JWT | ErrorResponse> {
    const headers = {
      'Authorization-MFA': 'pincode=' + pinCode,
    };
    return lastValueFrom(this.trySilentLogin(authUrl, headers));
  }

  authTimedOut() {
    REFRESH_TOKEN.delete();
  }

  logout(user: User): Observable<any> {
    const authorization = this.appContext.requestParams.get(
      'authorizationHeader'
    ) as string;
    let headers = {};
    if (this.utils.exists(authorization)) {
      headers = new HttpHeaders({ Authorization: authorization });
    }

    this.clearAllTokens();

    if (user && user.links && user.links.logout) {
      return this.http.delete<void>(user.links.logout, { headers });
    } else {
      return of({});
    }
  }

  changePassword(
    username: string,
    changePasswordUrl: string,
    currentPassword: string,
    newPassword: string
  ): Observable<AuthResponse> {
    const body = {
      password: newPassword,
    };

    const options = {
      withCredentials: true,
      headers: {
        ...this.buildAuthHeader({
          username: username,
          password: currentPassword,
        }),
        'Content-Type': 'application/json',
      },
      context: new HttpContext().set(ERROR_PASS_THROUGH, true),
    };

    return this.http
      .post<AuthResponse>(changePasswordUrl, body, options)
      .pipe(tap(this.updateStoredAuthDetails));
  }

  clearCurrentAuthToken() {
    return this.deleteAuthHeader();
  }

  clearAllTokens() {
    this.deleteAuthHeader();
    this.clearStoredTokens();
  }

  oidcLogin(authUrl: string, oidcJwt: string) {
    const config = {
      withCredentials: true,
      headers: new HttpHeaders().set('Authorization', 'Bearer ' + oidcJwt),
      context: new HttpContext().set(ERROR_PASS_THROUGH, true),
    };

    REMEMBER_ME.set(true);
    return this.http.get<AuthResponse>(authUrl, config).pipe(
      tap(this.updateStoredAuthDetails),
      map<AuthResponse, JWT>((response) => ({
        claims: this.jwtHelper.decodeToken(response.token),
        organizations: response.customClaims.organizations,
        canChangePassword: false,
        logoutUrl: response.links.logout,
      })),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          return throwError(() => ({
            status: err.status,
            data: { code: 'BAD_CREDENTIALS' },
          }));
        } else throw err;
      })
    );
  }

  setPinCode(url: string, pinCode: string | undefined) {
    const body = {
      pinCode: pinCode,
    };

    const config = {
      context: new HttpContext().set(ERROR_PASS_THROUGH, true),
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return lastValueFrom(
      this.http.post(url, body, config).pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status in [401, 403])
            console.error('User is not authorized to call setPinCode()');
          return throwError(() => err);
        })
      )
    );
  }

  private updateStoredAuthDetails = (authResponse: AuthResponse): void => {
    this.updateRefreshToken(authResponse.refreshToken);
    this.defaultAuthHeader(authResponse.type + ' ' + authResponse.token);
  };

  private updateRefreshToken = (refreshToken: string): void => {
    if (REMEMBER_ME.get() ?? false) {
      AUTO_LOGIN_TOKEN.set(refreshToken);
    } else {
      REFRESH_TOKEN.set(refreshToken);
    }
  };

  isBypassingLoginScreen = (): boolean => {
    return BYPASS_TOKEN_KEY.get() !== null;
  };

  getBypassCredentials = (): BypassLoginCredentials => {
    const token = BYPASS_TOKEN_KEY.get();
    if (token === null) {
      console.error('Auth token not set in session storage');
      throw new Error('Auth token not set in session storage');
    }

    const customClaims = BYPASS_CUSTOM_CLAIMS_KEY.get();
    if (customClaims === null) {
      console.error('Custom claims not set in session storage');
      throw new Error('Custom claims not set in session storage');
    }

    return {
      token: token,
      //@ts-ignore
      customClaims: customClaims,
    };
  };

  private tryGetRefreshToken(): string | null {
    if (REFRESH_TOKEN.get()) {
      return REFRESH_TOKEN.get();
    }

    if (AUTO_LOGIN_TOKEN.get()) {
      return AUTO_LOGIN_TOKEN.get();
    }
    return null;
  }

  clearStoredTokens() {
    REFRESH_TOKEN.delete();
    AUTO_LOGIN_TOKEN.delete();
    REMEMBER_ME.delete();
  }

  setCanChangePassword(canChange: boolean): void {
    CAN_CHANGE_PASSWORD.set(canChange);
  }

  createCredentials(
    jwt: string,
    customClaims: any,
    canChangePassword: boolean,
    logoutUrl: string | undefined
  ): JWT {
    const claims = this.jwtHelper.decodeToken(jwt);
    return {
      claims: claims,
      organizations: customClaims.organizations,
      canChangePassword: canChangePassword,
      logoutUrl: logoutUrl !== null ? logoutUrl : undefined,
    };
  }

  buildAuthHeader(
    credentials: Credentials
  ): { authorization: string } | undefined {
    let authorization = undefined;
    if ('username' in credentials) {
      const encodedCredentials = btoa(
        `${credentials.username}:${credentials.password}`
      );
      authorization = `Basic ${encodedCredentials}`;
    } else if ('token' in credentials) {
      authorization = `${credentials.type} ${credentials.token!}`;
    }

    return authorization !== undefined ? { authorization } : undefined;
  }

  private defaultAuthHeader = (authHeader: string): void => {
    this.appContext.requestParams.set('authorizationHeader', authHeader);
  };

  private deleteAuthHeader() {
    if (this.appContext.requestParams.containsKey('authorizationHeader')) {
      this.appContext.requestParams.getAndClear('authorizationHeader');
    }
  }

  patientAuthHeader = (authHeader: string): void => {
    this.appContext.requestParams.set('patientAuthorizationHeader', authHeader);
  };

  deletePatientAuthHeader() {
    if (
      this.appContext.requestParams.containsKey('patientAuthorizationHeader')
    ) {
      this.appContext.requestParams.getAndClear('patientAuthorizationHeader');
    }
  }

  private wrapError(response: HttpErrorResponse): ErrorResponse {
    const status = response.status;

    if (status === 401 && this.utils.exists(response.error.errors)) {
      const errors = response.error.errors as ErrorMessage[];
      const reason = errors[0].error;
      const field = errors[0].field;
      if (field.toLowerCase() === 'authorization-mfa') {
        return {
          status: status,
          data: { code: 'BAD_MFA_CREDENTIALS' },
        };
      } else {
        switch (reason) {
          case 'invalid':
            return { status: status, data: { code: 'BAD_CREDENTIALS' } };
          case 'locked':
            return { status: status, data: { code: 'ACCOUNT_LOCKED' } };
          case 'inactive':
            return { status: status, data: { code: 'USER_INACTIVE' } };
          case 'expired':
            return { status: status, data: { code: 'PASSWORD_EXPIRED' } };
          case 'pincode_required':
            return { status: status, data: { code: 'PINCODE_REQUIRED' } };
          default:
            return { status: status, data: { code: 'UNKNOWN' } };
        }
      }
    } else {
      return { status: status, data: { code: 'UNKNOWN' } };
    }
  }

  private cleanUp(response: ErrorResponse): ErrorResponse {
    const status = response.status;
    const data = response.data;
    switch (status) {
      case 401: {
        switch (data.code) {
          case 'PINCODE_REQUIRED':
          case 'BAD_MFA_CREDENTIALS':
          case 'ACCOUNT_LOCKED':
            return { status, data };
          default:
            this.clearStoredTokens();
            // we must return bad credentials here because we need to go to
            // the login screen to get the username, which has been
            // cleared...
            return { status, data: { ...data, code: 'BAD_CREDENTIALS' } };
        }
      }
      default:
        return response;
    }
  }

  public isJWT(candidate: unknown): candidate is JWT {
    return (
      typeof candidate === 'object' &&
      candidate !== null &&
      ['claims', 'organizations', 'canChangePassword'].every(
        (property) => property in candidate
      )
    );
  }
}
