import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRoot } from '@app/types/api.type';
import { Clinician } from '@app/types/calendar-event.type';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { Utils } from '@services/util-services/util.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClinicianService {
  constructor(private util: Utils, private http: HttpClient) {}

  private userIsClinician: boolean = false;

  setIsClinician(bool: boolean) {
    this.userIsClinician = bool;
  }

  isClinician(): boolean {
    return this.userIsClinician;
  }

  canActivate(): boolean {
    return this.userIsClinician;
  }

  currentClinician(root: ApiRoot): Promise<Clinician> {
    const clinicianUrl = root?.links?.clinician;
    if (!this.util.exists(clinicianUrl)) {
      throw new TypeError(
        'Root object does not contain a link relation to clinician'
      );
    }

    return lastValueFrom(this.http.get<Clinician>(clinicianUrl));
  }
}
