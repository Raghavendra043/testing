import { Component, OnInit } from '@angular/core';
import { ApiRoot } from 'src/app/types/api.type';
import { ErrorResponse, JWT } from 'src/app/types/response.type';
import { UserSessionService } from 'src/app/services/state-services/user-session.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/rest-api-services/authentication.service';
import { from } from 'rxjs';
import { Idle } from '@ng-idle/core';
import { LOGIN_TYPE_INFO } from '@utils/globals';
import { LoadingState } from '@app/types/loading.type';

interface Model {
  showPopup: boolean;
  showLoginForm: boolean;
  username?: string;
  password?: string;
  error?: string;
  info?: string;
  rememberMe: boolean;
  state: LoadingState;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  model: Model = {
    showPopup: false,
    showLoginForm: false,
    rememberMe: false,
    state: 'Initial',
  };
  root?: ApiRoot;

  constructor(
    private userSession: UserSessionService,
    private appContext: StatePassingService,
    private authentication: AuthenticationService,
    private router: Router,
    private idle: Idle
  ) {}

  async ngOnInit() {
    this.stopIdleWatcher();
    this.setupErrorMessage();
    from(this.userSession.init());

    try {
      const root = await this.userSession.init();
      this.root = root;
      this.userSession.startSilentLogin(root, (error: ErrorResponse) =>
        this.loginFailed(this, error)
      );
    } catch (err) {
      this.connectionError();
    }
  }

  private loginFailed(
    component: LoginComponent,
    response: ErrorResponse
  ): void {
    const status = response.status;
    const data = response.data;
    component.model.showLoginForm = true;

    if (status && status > -1) {
      switch (status) {
        case 401:
          if (data.code === 'PASSWORD_EXPIRED') {
            const info = {
              username: component.model.username,
              changePasswordUrl: component.root?.links.auth,
            };
            component.appContext.requestParams.set('userInfo', info);
            component.appContext.requestParams.set('forceChange', true);
            component.router.navigate(['/change_password']);
          } else {
            delete component.model.password;
            component.model.error = data.code;
          }
          break;

        default:
          component.model.error = 'OPENTELE_DOWN_TEXT';
          break;
      }
    }
    this.model.state = 'Loaded';
  }

  submit() {
    this.model.state = 'Loading';
    const root = this.root;
    if (
      root === undefined ||
      this.model.username === undefined ||
      this.model.password === undefined
    ) {
      return;
    }

    const credentials = {
      username: this.model.username,
      password: this.model.password,
    };

    const completed = (response: ErrorResponse | JWT) => {
      if ('data' in response) {
        this.loginFailed(this, response);
        return;
      }
      const { claims, canChangePassword, logoutUrl, organizations }: JWT =
        response;
      this.userSession
        .completeLogin(
          root,
          claims,
          canChangePassword,
          logoutUrl,
          organizations
        )
        .then(() => {
          const loginInfo = LOGIN_TYPE_INFO.get();
          if (loginInfo) {
            this.model.info = loginInfo;
          }
          this.model.state = 'Loaded';
        });
    };

    this.authentication
      .login(root.links.auth, credentials, this.model.rememberMe)
      .subscribe(completed);
  }

  setupErrorMessage(): void {
    const key = 'authenticationError';
    if (!this.appContext.requestParams.containsKey(key)) {
      this.model.error = '';
      return;
    }

    this.model.error = this.appContext.requestParams.getAndClear(key) as string;
  }

  connectionError() {
    this.model.error = 'OPENTELE_UNAVAILABLE_TEXT';
  }

  stopIdleWatcher(): void {
    if (this.idle.isRunning()) {
      this.idle.stop();
    }
  }
}
