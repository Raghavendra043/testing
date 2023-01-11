import { Injectable } from '@angular/core';
import { Utils } from '@services/util-services/util.service';
import { User } from '@app/types/user.type';
import {
  Questionnaire,
  QuestionnaireRef,
  Questionnaires,
} from '@app/types/questionnaires.type';
import { HttpClient, HttpContext } from '@angular/common/http';
import {
  ERROR_PASS_THROUGH,
  SILENT_REQUEST,
} from '@app/interceptors/interceptor';
import { lastValueFrom } from 'rxjs';
import { ClinicianService } from './clinician.service';
import { StatePassingService } from '@services/state-services/state-passing.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionnairesService {
  constructor(
    private util: Utils,
    private clinicianService: ClinicianService,
    private appContext: StatePassingService,
    private http: HttpClient
  ) {}

  list(user: User, params?: any): Promise<Questionnaires> {
    if (!this.util.exists(user.links.questionnaires)) {
      throw new TypeError(
        'User object does not contain a link relation to questionnaires'
      );
    } else {
      if (params) {
        //@ts-ignore
        return lastValueFrom(
          this.http.get<Questionnaires>(user.links.questionnaires, {
            params: params,
            context: new HttpContext().set(ERROR_PASS_THROUGH, true),
          })
        );
      } else {
        return lastValueFrom(
          this.http.get<Questionnaires>(user.links.questionnaires)
        );
      }
    }
  }

  get(questionnaireRef: QuestionnaireRef | any): Promise<Questionnaire> {
    if (!this.util.hasNestedProperty(questionnaireRef, 'links.questionnaire')) {
      throw new TypeError(
        'Questionnaire ref does not contain a link relation to questionnaire details'
      );
    } else {
      return lastValueFrom(
        this.http.get<Questionnaire>(questionnaireRef.links.questionnaire)
      );
    }
  }

  getHelpImage({ imageUrl }: { imageUrl: string }): Promise<string> {
    return lastValueFrom(
      this.http.get(imageUrl, {
        responseType: 'text',
        context: new HttpContext()
          .set(ERROR_PASS_THROUGH, true)
          .set(SILENT_REQUEST, true),
      })
    );
  }

  replyTo(questionnaire: Questionnaire | any, outputs: unknown): Promise<any> {
    const isClinician = this.clinicianService.isClinician();
    const data = {
      version: questionnaire.version,
      output: outputs,
      date: new Date().toISOString(),
    };
    if (isClinician) {
      console.debug('Posting questionnaire as clinician');
      const patient = this.appContext.getUser();
      data['links'] = { patient: patient.links.self };
    }

    console.debug(`POST questionnaire data: ${JSON.stringify(data)}`);
    const config = { context: new HttpContext().set(ERROR_PASS_THROUGH, true) };
    const result = questionnaire.links.questionnaireResult;

    return lastValueFrom(this.http.post(result, data, config));
  }
}
