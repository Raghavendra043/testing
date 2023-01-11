import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ERROR_PASS_THROUGH,
  SILENT_REQUEST,
} from "@app/interceptors/interceptor";
import { AppConfig } from "@app/types/config.type";
import { ConfigService } from "@services/state-services/config.service";
import { calcUrl } from "@utils/environment-utils";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class QuestionnaireGroupsService {
  appConfig: AppConfig;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.appConfig = this.configService.getAppConfig();
  }

  list(params?: any): Promise<any> {
    const url = calcUrl(
      this.appConfig.baseUrl,
      "questionnaires/questionnaire-groups"
    );
    if (params) {
      //@ts-ignore
      return lastValueFrom(
        this.http.get<any>(url, {
          params: params,
          context: new HttpContext().set(ERROR_PASS_THROUGH, true),
        })
      );
    } else {
      return lastValueFrom(this.http.get<any>(url));
    }
  }

  async getQuestionnaires(url: string, params: any): Promise<any> {
    const questionnaireUrls = [];
    const questionnaires = [];
    try {
      const questionnaireGroup = await lastValueFrom(
        this.http.get<any>(url, {
          params: params,
          context: new HttpContext().set(ERROR_PASS_THROUGH, true),
        })
      );
      for (const questionnaireDefUrl of questionnaireGroup.questionnaires) {
        const questionnaireDef = await lastValueFrom(
          this.http.get<any>(questionnaireDefUrl, {
            params: params,
            context: new HttpContext()
              .set(ERROR_PASS_THROUGH, true)
              .set(SILENT_REQUEST, true),
          })
        );

        if (questionnaireDef?.links?.activeQuestionnaire) {
          questionnaireUrls.push(questionnaireDef.links.activeQuestionnaire);
        }
      }

      for (const url of questionnaireUrls) {
        const questionnaire = await lastValueFrom(
          this.http.get<any>(url, {
            params: params,
            context: new HttpContext()
              .set(ERROR_PASS_THROUGH, true)
              .set(SILENT_REQUEST, true),
          })
        );
        const newUrl = questionnaire.links.questionnaireResult.substring(
          0,
          questionnaire.links.questionnaireResult.lastIndexOf("/")
        );
        questionnaire.links["questionnaire"] = newUrl; // Hack to make questionnaire url
        questionnaires.push(questionnaire);
      }

      return questionnaires;
    } catch (e) {
      throw new Error(`Failed due to: ${e}`);
    }
  }
}
