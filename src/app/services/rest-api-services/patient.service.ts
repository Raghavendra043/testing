import { Injectable } from "@angular/core";
import { Utils } from "../util-services/util.service";
import { HttpClient, HttpContext } from "@angular/common/http";
import { ApiRoot, PatientGetResponse } from "@app/types/api.type";
import { Clinician, Patient, PatientRef } from "@app/types/calendar-event.type";
import { lastValueFrom } from "rxjs";
import { ERROR_PASS_THROUGH } from "@app/interceptors/interceptor";
import { User } from "@app/types/user.type";

@Injectable({
  providedIn: "root",
})
export class PatientService {
  constructor(private util: Utils, private http: HttpClient) {}

  currentPatient(root: PatientRef | ApiRoot): Promise<Patient> {
    const patientUrl = root?.links?.patient;
    if (!this.util.exists(patientUrl)) {
      throw new TypeError(
        "Root object does not contain a link relation to patient"
      );
    }

    return lastValueFrom(this.http.get<Patient>(patientUrl));
  }

  getSelf(patient: any): Promise<any> {
    const patientUrl = patient?.links?.self;
    if (!this.util.exists(patientUrl)) {
      throw new TypeError(
        "Patient object does not contain a link relation to self"
      );
    }

    return lastValueFrom(this.http.get<Patient>(patientUrl));
  }

  find(user: any, patientsParameters: any): Promise<PatientGetResponse> {
    if (
      !user.hasOwnProperty("links") ||
      !user.links.hasOwnProperty("patients")
    ) {
      throw new TypeError(
        "User object does not contain a link relation to patients"
      );
    }

    return lastValueFrom(
      this.http.get<PatientGetResponse>(user.links.patients, {
        params: patientsParameters,
        context: new HttpContext().set(ERROR_PASS_THROUGH, true),
      })
    );
  }
  create(user: User, body: object) {
    if (
      !user.hasOwnProperty("links") ||
      !user.links.hasOwnProperty("patients")
    ) {
      throw new TypeError(
        "User object does not contain a link relation to patients"
      );
    }
    console.debug(JSON.stringify(body));
    const config = {
      context: new HttpContext().set(ERROR_PASS_THROUGH, true),
    };

    return lastValueFrom(
      //@ts-ignore
      this.http.post<PatientCreateResponse>(user.links.patients, body, config)
    );
  }

  get(user: Clinician, patientRef: any) {
    if (
      !user.hasOwnProperty("links") ||
      !user.links.hasOwnProperty("patients")
    ) {
      throw new TypeError(
        "User object does not contain a link relation to patients"
      );
    }

    const patientLink = patientRef.links.patient;

    return lastValueFrom(this.http.get<any>(patientLink));
  }
}
