import { Component, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingState } from '@app/types/loading.type';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '@services/rest-api-services/authentication.service';
import { Idp2Service } from '@services/rest-api-services/idp2.service';
import { PatientService } from '@services/rest-api-services/patient.service';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { UserSessionService } from '@services/state-services/user-session.service';
import { Utils } from '@services/util-services/util.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { PatientGroupLink, User } from '@app/types/user.type';
import { CreatePatientForm, sexListItem } from '@app/types/form.type';
import { PatientCreateResponse } from '@app/types/api.type';
import { TokenResponse } from '@app/types/response.type';
import { ThresholdService } from '@services/rest-api-services/threshold.service';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.less'],
})
export class CreatePatientComponent {
  hasPermissions: boolean = false;

  sexList: sexListItem[] = [
    {
      name: this.translate.instant('CREATE_PATIENT_SEX_UNKNOWN'),
      value: 'unknown',
    },
    {
      name: this.translate.instant('CREATE_PATIENT_SEX_MALE'),
      value: 'male',
    },
    {
      name: this.translate.instant('CREATE_PATIENT_SEX_FEMALE'),
      value: 'female',
    },
  ];
  sexModel: sexListItem[] = [this.sexList[0]]; // Required to preselect sex

  numberRegex = new RegExp('(?=.*[0-9])');
  characterRegex = new RegExp('(?=.*[a-zA-Z])');
  createPatientForm: FormGroup = this.formBuilder.group({
    uniqueId: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    sex: [this.sexList[0], Validators.required],
    username: ['', Validators.required],
    temporaryPassword: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(new RegExp('(?=.*[0-9])')),
        Validators.pattern(new RegExp('(?=.*[a-zA-Z])')),
      ]),
    ],
    patientGroups: ['', Validators.required],
    // Contact Info
    address: ['', Validators.required],
    postalCode: ['', Validators.required],
    city: ['', Validators.required],
    phone: [''],
    email: [''],
    dateOfBirth: ['', Validators.required],
  });

  model: {
    state: LoadingState;
    errors: string[] | undefined;
  } = {
    state: 'Initial',
    errors: undefined,
  };

  patientGroupList: any[] = [];
  multiselectSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'link',
    textField: 'name',
    searchPlaceholderText: this.translate.instant('SEARCH'),
    noDataAvailablePlaceholderText: this.translate.instant('NO_DATA_AVAILABLE'),
    enableCheckAll: false,
    allowSearchFilter: true,
  };

  selectSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'value',
    textField: 'name',
    searchPlaceholderText: this.translate.instant('SEARCH'),
    noDataAvailablePlaceholderText: this.translate.instant('NO_DATA_AVAILABLE'),
    enableCheckAll: false,
    allowSearchFilter: false,
    closeDropDownOnSelection: true,
  };

  user: User;
  constructor(
    private formBuilder: FormBuilder,
    private appContext: StatePassingService,
    private patientService: PatientService,
    private router: Router,
    private translate: TranslateService,
    private utils: Utils,
    private authentication: AuthenticationService,
    private userSession: UserSessionService,
    private idp2Service: Idp2Service,
    private thresholdService: ThresholdService,
    private elementRef: ElementRef
  ) {
    this.user = this.appContext.currentUser.get()!;
    this.hasPermissions = this.idp2Service.clinicianHasPermissions();
    if (this.user.patientGroups) {
      this.renderPatientGroups(this.user.patientGroups);
    }
    this.temporaryPassword.setValue(this.makeTempPassword());
  }
  makeTempPassword(): string {
    let pw = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 8;

    for (let i = 0; i < length; i++) {
      pw += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    if (
      this.numberRegex.test(pw) &&
      this.characterRegex.test(pw) &&
      pw.length === length
    ) {
      return pw;
    } else {
      return this.makeTempPassword();
    }
  }

  renderPatientGroups(patientGroupList: PatientGroupLink[]) {
    this.patientGroupList = [];
    if (patientGroupList) {
      for (const patientGroup of patientGroupList) {
        this.patientGroupList?.push({
          name: patientGroup.name,
          link: patientGroup.links.patientGroup,
        });
      }
    }
  }

  makeRequestBody(form: CreatePatientForm): CreatePatientForm {
    const requestObj = form;

    if (requestObj.sex) {
      const sex = requestObj.sex[0].value;
      requestObj.sex = sex;
    }

    if (requestObj.patientGroups) {
      const patientGroups = requestObj.patientGroups;
      delete requestObj['patientGroups'];
      requestObj['links'] = { patientGroups: [] };
      if (patientGroups) {
        for (const group of patientGroups) {
          if (requestObj.links.patientGroups) {
            requestObj.links.patientGroups.push(group.link);
          }
        }
      }
    }

    // Remove falsy entries and return
    Object.keys(requestObj).forEach(
      (k) => !requestObj[k] && delete requestObj[k]
    );

    return requestObj;
  }

  async createPatient() {
    this.model.state = 'Loading';
    this.model.errors = undefined;
    const body = this.makeRequestBody(this.createPatientForm.value);
    try {
      const response: PatientCreateResponse = await this.patientService.create(
        this.user,
        body
      );
      await this.thresholdService.addPatientGroupThresholdsToPatient(
        response,
        body.links.patientGroups
      );
      this.model.state = 'Loaded';
      console.debug(
        `Patient created with temp password: '${response.temporaryPassword}'`
      );
      let patient: any = undefined;
      const tokenObj: TokenResponse = await this.idp2Service.getToken(
        response.links.self
      );
      this.authentication.patientAuthHeader(
        tokenObj.type + ' ' + tokenObj.token
      );
      const patientObj = await this.patientService.getSelf(response);
      patient = this.userSession.setPatientUser(patientObj, tokenObj);
      if (patient) {
        this.appContext.requestParams.set('selectedPatient', patient);
        this.router.navigate(['/menu']);
      }
    } catch (e) {
      this.model.state = 'Failed';
      console.error(`Failed to fetch patients due to error: ${e}`);
      console.error(JSON.stringify(e));
      this.handleError(e);
    }
  }

  handleError = (rejection: any) => {
    this.model.errors = [];
    const message = rejection.message;
    const errors = rejection.error.errors;
    if (this.utils.exists(message) && this.utils.exists(errors)) {
      for (const error of errors) {
        const code = error.code;
        const fieldName = error.field;
        // Ugly code hack due to backend respond with error in both password and cleartextPassword
        if (fieldName !== 'password') {
          if (code === 'invalid') {
            let field = '';
            switch (fieldName) {
              case 'cleartextPassword':
                field = this.translate.instant('CREATE_PATIENT_TEMP_PASSWORD');
                break;
              case 'uniqueId':
                field = this.translate.instant('CREATE_PATIENT_UNIQUE_ID');
                break;
              case 'username':
                field = this.translate.instant('LOGIN_FORM_USERNAME');
                break;
              default:
                field = this.translate.instant('UNKNOWN') + ` (${fieldName})`;
                console.error(`Unknown field: ${fieldName}`);

                break;
            }
            const invalidFieldMessage = this.translate.instant(
              'CREATE_PATIENT_INVALID_FIELD'
            );
            this.model.errors.push(`${invalidFieldMessage} ${field}`);
          }
        }
      }
    }
  };

  closeMultiselect() {
    this.elementRef.nativeElement
      .querySelector('#patient-groups-label')
      .click();
  }

  // Form controls
  get uniqueId(): FormControl {
    return this.createPatientForm.get('uniqueId') as FormControl;
  }
  get firstName(): FormControl {
    return this.createPatientForm.get('firstName') as FormControl;
  }
  get lastName(): FormControl {
    return this.createPatientForm.get('firstName') as FormControl;
  }
  get sex(): FormControl {
    return this.createPatientForm.get('sex') as FormControl;
  }
  get dateOfBirth(): FormControl {
    return this.createPatientForm.get('dateOfBirth') as FormControl;
  }
  get username(): FormControl {
    return this.createPatientForm.get('username') as FormControl;
  }
  get temporaryPassword(): FormControl {
    return this.createPatientForm.get('temporaryPassword') as FormControl;
  }
  get patientGroups(): FormControl {
    return this.createPatientForm.get('patientGroups') as FormControl;
  }
  get address(): FormControl {
    return this.createPatientForm.get('address') as FormControl;
  }
  get postalCode(): FormControl {
    return this.createPatientForm.get('postalCode') as FormControl;
  }
  get city(): FormControl {
    return this.createPatientForm.get('city') as FormControl;
  }
  get phone(): FormControl {
    return this.createPatientForm.get('phone') as FormControl;
  }
  get email(): FormControl {
    return this.createPatientForm.get('email') as FormControl;
  }
}
