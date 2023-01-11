import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientGetResponse } from '@app/types/api.type';
import { PatientRef } from '@app/types/calendar-event.type';
import { LoadingState } from '@app/types/loading.type';
import { TokenResponse } from '@app/types/response.type';
import { User } from '@app/types/user.type';
import { Idle } from '@ng-idle/core';
import { AuthenticationService } from '@services/rest-api-services/authentication.service';
import { Idp2Service } from '@services/rest-api-services/idp2.service';
import { PatientService } from '@services/rest-api-services/patient.service';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { UserSessionService } from '@services/state-services/user-session.service';

@Component({
  selector: 'app-clinician-menu',
  templateUrl: './clinician-menu.component.html',
  styleUrls: ['./clinician-menu.component.less'],
})
export class ClinicianMenuComponent {
  searchPatientForm: FormGroup = this.formBuilder.group({
    firstName: [''],
    lastName: [''],
    uniqueId: [''],
    phone: [''],
  });

  model: {
    state: LoadingState;
    patients: PatientRef[] | undefined;
    canChangePassword: boolean;
  } = {
    state: 'Initial',
    patients: undefined,
    canChangePassword: false,
  };

  user: User | undefined;
  hasPermissions: boolean = false;

  constructor(
    private appContext: StatePassingService,
    private patientService: PatientService,
    private idp2Service: Idp2Service,
    private router: Router,
    private formBuilder: FormBuilder,
    private authentication: AuthenticationService,
    private userSession: UserSessionService,
    private idle: Idle
  ) {
    this.startIdleWatcher();
    this.user = this.appContext.currentUser.get()!;
    this.hasPermissions = this.idp2Service.clinicianHasPermissions();
  }

  async search() {
    this.model.state = 'Loading';
    const params = this.searchPatientForm.value;
    params['max'] = 10000;
    try {
      const response: PatientGetResponse = await this.patientService.find(
        this.user,
        params
      );
      this.model.state = 'Loaded';
      this.model.patients = response.results;
    } catch (e) {
      this.model.state = 'Failed';
      console.error(`Failed to fetch patients due to error: ${e}`);
    }
  }

  goCreatePatient(event: Event) {
    event.preventDefault();
    this.router.navigate(['/create_patient']);
  }

  async choosePatient(selectedPatient: PatientRef) {
    let patient: User;
    try {
      const tokenObj: TokenResponse = await this.idp2Service.getToken(
        selectedPatient.links.patient
      );
      this.authentication.patientAuthHeader(
        tokenObj.type + ' ' + tokenObj.token
      );
      const patientObj = await this.patientService.currentPatient(
        selectedPatient
      );
      patient = this.userSession.setPatientUser(patientObj, tokenObj);
      if (patient) {
        this.appContext.requestParams.set('selectedPatient', patient);
        this.router.navigate(['/menu']);
      }
    } catch (e) {
      this.model.state = 'Failed';
      console.error(`Failed to fetch patient due to error: ${e}`);
      console.error(JSON.stringify(e));
    }
  }

  startIdleWatcher(): void {
    if (this.idle.isRunning()) {
      return;
    }
    this.idle.watch();
  }

  get firstName(): FormControl {
    return this.searchPatientForm.get('firstName') as FormControl;
  }
  get lastName(): FormControl {
    return this.searchPatientForm.get('firstName') as FormControl;
  }
  get uniqueId(): FormControl {
    return this.searchPatientForm.get('uniqueId') as FormControl;
  }
  get phone(): FormControl {
    return this.searchPatientForm.get('phone') as FormControl;
  }
}
