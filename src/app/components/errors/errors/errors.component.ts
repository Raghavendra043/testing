import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClinicianService } from '@services/rest-api-services/clinician.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';

enum ErrorCodes {
  NETWORK_ERROR = 'OPENTELE_DOWN_TEXT',
  INVALID_QUESTIONNAIRE = 'OPENTELE_INVALID_QUESTIONNAIRE',
  NO_NATIVE_LAYER = 'OPENTELE_NO_NATIVE_LAYER',
  RUNTIME_ERROR = 'OPENTELE_RUNTIME_ERROR',
}
const errors = Object.values(ErrorCodes);

const DEFAULT_ERROR: string = ErrorCodes.RUNTIME_ERROR;

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.less'],
})
export class ErrorsComponent implements OnInit {
  model = {
    description: DEFAULT_ERROR,
  };

  constructor(
    private appContext: StatePassingService,
    private router: Router,
    private clinicianService: ClinicianService
  ) {}

  ngOnInit() {
    if (this.appContext.requestParams.containsKey('exception')) {
      const exception = this.appContext.requestParams.getAndClear('exception');
      this.model.description = this.determineErrorMessage(exception);
      console.error(this.model.description + ': ' + JSON.stringify(exception));
    }
  }

  private isError(err: unknown): err is { code: number } {
    return (
      typeof err === 'object' &&
      err != null &&
      'code' in err &&
      typeof err['code'] == 'number'
    );
  }

  private determineErrorMessage(exception: unknown) {
    if (this.isError(exception) && exception.code in errors) {
      return errors[exception.code];
    } else return DEFAULT_ERROR;
  }

  async leaveErrorPage() {
    const isClinician = this.clinicianService.isClinician();
    if (isClinician) {
      await this.router.navigate(['/clinician_menu']);
    } else {
      await this.router.navigate(['/menu']);
    }
  }
}
