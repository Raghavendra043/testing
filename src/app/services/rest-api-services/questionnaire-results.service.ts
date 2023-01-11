import { Injectable } from '@angular/core';
import {
  QuestionnaireResult,
  QuestionnaireResultRef,
  QuestionnaireResults,
} from 'src/app/types/questionnaire-results.type';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireResultsService {
  constructor(private http: HttpClient) {}

  list = (url: string): Promise<QuestionnaireResults> => {
    const orderedURL =
      url.indexOf('?') > 0 ? `${url}&order=desc` : `${url}?order=desc`;

    return lastValueFrom(this.http.get<QuestionnaireResults>(orderedURL));
  };

  show = (
    questionnaireResultRef: QuestionnaireResultRef
  ): Promise<QuestionnaireResult> => {
    const url = questionnaireResultRef.links.questionnaireResult;
    return lastValueFrom(this.http.get<QuestionnaireResult>(url));
  };
}
