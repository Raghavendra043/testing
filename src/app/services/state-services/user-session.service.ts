import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppType } from '@app/types/config.type';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ClinicianService } from '@services/rest-api-services/clinician.service';
import { LOGIN_TYPE_INFO } from '@utils/globals';
import { lastValueFrom, throwError } from 'rxjs';
import { ApiRoot } from 'src/app/types/api.type';
import { Organization } from 'src/app/types/organization.type';
import { ErrorResponse, JWT } from 'src/app/types/response.type';
import { User } from 'src/app/types/user.type';
import { AuthenticationService } from '../rest-api-services/authentication.service';
import { ClientLoggingService } from './client-logging.service';
import { NotificationsService } from '../rest-api-services/notifications.service';
import { PatientService } from '../rest-api-services/patient.service';
import { ServerInfoService } from '../rest-api-services/server-info.service';
import { VideoService } from '../video-services/video.service';
import { ConfigService } from './config.service';
import { StatePassingService } from './state-passing.service';

@Injectable({
  providedIn: 'root',
})
export class UserSessionService {
  constructor(
    private authentication: AuthenticationService,
    private appContext: StatePassingService,
    private serverInfo: ServerInfoService,
    private patientService: PatientService,
    private router: Router,
    private videoFacade: VideoService,
    private notifications: NotificationsService,
    private clientLoggingService: ClientLoggingService,
    private clinicianService: ClinicianService,
    private configService: ConfigService
  ) {}
  private jwtHelper = new JwtHelperService();

  init(): Promise<ApiRoot> {
    console.debug('Init new user session.');

    this.authentication.clearCurrentAuthToken();
    this.appContext.currentUser.clear();
    this.appContext.requestParams.clear();
    this.notifications.clearPushNotificationRegistrationState();

    return lastValueFrom(this.serverInfo.get());
  }

  startSilentLogin(
    root: ApiRoot,
    silentLoginFailed: (err: ErrorResponse) => void
  ) {
    const completed: (response: JWT | ErrorResponse) => unknown = (
      response
    ) => {
      if ('data' in response) {
        return silentLoginFailed(response);
      }
      const { claims, canChangePassword, logoutUrl, organizations } = response;

      return this.completeLogin(
        root,
        claims,
        canChangePassword,
        logoutUrl,
        organizations
      );
    };

    return this.authentication
      .trySilentLogin(root.links.auth)
      .subscribe({ next: completed, error: silentLoginFailed });
  }

  enableClientLogging = (user: User): void => {
    if (user.links.logEntries) {
      this.clientLoggingService.enable(user.links.logEntries);
    } else {
      console.info('Client logging not enabled.');
    }
  };

  async completeLogin(
    root: ApiRoot,
    claims: any,
    canChangePassword: boolean,
    logoutUrl: string | undefined,
    organizations: Organization[]
  ) {
    let user: any | undefined = undefined;
    claims.uty === 'patient'
      ? this.clinicianService.setIsClinician(false)
      : this.clinicianService.setIsClinician(true);
    const isClinician = this.clinicianService.isClinician();

    LOGIN_TYPE_INFO.delete();
    const config = this.configService.getAppConfig();
    const appType: AppType = config.appType;
    switch (appType) {
      case AppType.CLINICIAN: {
        if (isClinician) {
          user = await this.clinicianService.currentClinician(root);
        } else {
          console.error("AppType is 'Clinician' and user is not a clinician");
          LOGIN_TYPE_INFO.set('APP_TYPE_CLINICIAN');
        }
        break;
      }
      case AppType.CLINICIAN_AND_PATIENT: {
        if (isClinician) {
          user = await this.clinicianService.currentClinician(root);
        } else {
          user = await this.patientService.currentPatient(root);
        }
        break;
      }
      case AppType.PATIENT: {
        if (!isClinician) {
          user = await this.patientService.currentPatient(root);
        } else {
          console.error("AppType is 'Patient' and user is not a patient");
          LOGIN_TYPE_INFO.set('APP_TYPE_PATIENT');
        }
        break;
      }
      default: {
        user = undefined;
        console.error(`Unknown app type: ${appType}`);
      }
    }

    if (user === undefined) {
      console.error('User is undefined');
      return throwError({});
    }

    user.claims = claims;
    user.canChangePassword = canChangePassword;
    user.links.auth = root.links.auth;
    user.organizations = organizations;
    if (logoutUrl) {
      user.links.logout = logoutUrl;
    }

    this.appContext.currentUser.set(user);
    this.enableClientLogging(user);

    if (user.links && user.links.individualSessions) {
      this.videoFacade.listenForIncomingCall(user.links.individualSessions);
    }

    if (isClinician) {
      return this.router.navigate(['/clinician_menu']);
    } else {
      return this.router.navigate(['/menu']);
    }
  }

  setPatientUser(user: any, properties: any): User {
    const patient = structuredClone(user);
    patient.claims = this.jwtHelper.decodeToken(properties.token);
    patient.canChangePassword = false;
    const currentClinician = this.appContext.currentUser.get()!;
    patient.links.auth = currentClinician.links.auth;
    patient.organizations = properties.customClaims.organizations;
    if (properties?.links?.logout) {
      patient.links.logout = properties.links.logout;
    }
    if (patient.links && patient.links.individualSessions) {
      this.videoFacade.listenForIncomingCall(patient.links.individualSessions);
    }
    this.enableClientLogging(patient);

    return patient;
  }
}
