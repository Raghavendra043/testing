import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ERROR_PASS_THROUGH,
  SILENT_REQUEST,
} from '@app/interceptors/interceptor';
import { PatientCreateResponse } from '@app/types/api.type';
import { AppConfig } from '@app/types/config.type';
import { CreatePatientForm } from '@app/types/form.type';
import { ConfigService } from '@services/state-services/config.service';
import { calcUrl } from '@utils/environment-utils';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThresholdService {
  private appConfig: AppConfig;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.appConfig = this.configService.getAppConfig();
  }

  getThresholdForPatientGroup(patientGroupUrl: string) {
    const generalThresholdUrl = calcUrl(
      this.appConfig.baseUrl,
      'thresholds/patient-group-thresholds'
    );
    const url = calcUrl(
      generalThresholdUrl,
      `?patientGroup=${patientGroupUrl}`
    );

    const config = {
      context: new HttpContext()
        .set(ERROR_PASS_THROUGH, true)
        .set(SILENT_REQUEST, true),
    };

    return lastValueFrom(this.http.get<any>(url, config));
  }

  addThresholdToPatient(body: object) {
    const url = calcUrl(
      this.appConfig.baseUrl,
      'thresholds/patient-thresholds'
    );

    const config = {
      context: new HttpContext()
        .set(ERROR_PASS_THROUGH, true)
        .set(SILENT_REQUEST, true),
    };

    return lastValueFrom(this.http.post<any>(url, body, config));
  }

  async addPatientGroupThresholdsToPatient(
    patientResponseBody: PatientCreateResponse,
    patientGroupUrls: string[]
  ) {
    const patientUrl: string = patientResponseBody.links.self;

    for (const patientGroupUrl of patientGroupUrls) {
      const thresholds: any = await this.getThresholdForPatientGroup(
        patientGroupUrl
      );
      if (thresholds.results.length > 0) {
        for (const threshold of thresholds.results) {
          if (threshold.links) {
            delete threshold.links;
          }
          const body = { ...threshold, ...{ links: { patient: patientUrl } } };
          try {
            await this.addThresholdToPatient(body);
          } catch (response: any) {
            console.log('insde catch');
            console.log(response);
            if (response?.error?.errors) {
              const error = response.error.errors.find(
                (e: any) => e.error === 'exists'
              );
              error
                ? console.warn(
                    `Patient already has threshold: '${
                      threshold.measurementType
                    }' so this threshold will be ignored ${JSON.stringify(
                      threshold
                    )}`
                  )
                : console.warn(
                    `Error occured when creating threshold for patient: ${JSON.stringify(
                      response
                    )}`
                  );
            }
          }
        }
      } else {
        console.debug(
          `Patient group: '${patientGroupUrl}' does not have any thresholds`
        );
      }
    }
  }
}
