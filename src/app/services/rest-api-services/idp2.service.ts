import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ERROR_PASS_THROUGH } from '@app/interceptors/interceptor';
import { ApiRoot } from '@app/types/api.type';
import { Clinician } from '@app/types/calendar-event.type';
import { AppConfig } from '@app/types/config.type';
import { User } from '@app/types/user.type';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfigService } from '@services/state-services/config.service';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { Utils } from '@services/util-services/util.service';
import { calcUrl } from '@utils/environment-utils';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Idp2Service {
  private appConfig: AppConfig;
  private jwtHelper = new JwtHelperService();

  private permissions: string[] = ['write: tokens'];

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private appContext: StatePassingService
  ) {
    this.appConfig = this.configService.getAppConfig();
  }

  getToken(link: string): Promise<any> {
    const url = calcUrl(this.appConfig.baseUrl, 'idp2/tokens');
    const config = {
      context: new HttpContext().set(ERROR_PASS_THROUGH, true),
    };

    const body = {
      links: {
        patient: link,
      },
    };
    return lastValueFrom(this.http.post<any>(url, body, config));
  }

  clinicianHasPermissions(): boolean {
    const token = this.appContext.requestParams.get(
      'authorizationHeader'
    ) as string;
    if (token) {
      const claims = this.jwtHelper.decodeToken(token);
      for (const permission of this.permissions) {
        if (!claims.perm.includes(permission)) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }
}
