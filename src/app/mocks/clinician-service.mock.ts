import { Injectable } from '@angular/core';
import { ApiRoot } from '@app/types/api.type';
import { Clinician } from '@app/types/clinician.type';

Injectable();
export class FakeClinicianService {
  constructor(private userIsClinician: boolean) {}

  setIsClinician(bool: boolean) {
    this.userIsClinician = bool;
  }

  isClinician(): boolean {
    return this.userIsClinician;
  }

  canActivate(): boolean {
    return this.userIsClinician;
  }

  currentClinician(root: ApiRoot, returnObj?: any): Promise<Clinician> {
    const clinicianUrl = root?.links?.clinician;
    if (!clinicianUrl) {
      throw new TypeError(
        'Root object does not contain a link relation to clinician'
      );
    }

    return new Promise(returnObj);
  }
}
