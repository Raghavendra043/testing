import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionnaireResultsService } from 'src/app/services/rest-api-services/questionnaire-results.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { QuestionnaireResultsModel } from 'src/app/types/model.type';
import {
  QuestionnaireResultRef,
  QuestionnaireResults,
} from 'src/app/types/questionnaire-results.type';
import { User } from 'src/app/types/user.type';

@Component({
  selector: 'app-questionnaire-results',
  templateUrl: './questionnaire-results.component.html',
  styleUrls: ['./questionnaire-results.component.less'],
})
export class QuestionnaireResultsComponent {
  model: QuestionnaireResultsModel = {
    questionnaireResults: [],
    pagination: undefined,
    state: 'Loading',
  };
  requestParams: any;

  constructor(
    private appContext: StatePassingService,
    private questionnaireResultsService: QuestionnaireResultsService,
    private router: Router
  ) {
    const model: QuestionnaireResultsModel = {
      questionnaireResults: [],
      pagination: {
        self: '',
      },
      state: 'Loading',
    };
    this.model = model;
    const user = this.appContext.getUser();
    this.requestParams = this.appContext.requestParams;

    if (this.requestParams.containsKey(constants.questionnaireResultsPage)) {
      this.showPage(
        this.requestParams.getAndClear(constants.questionnaireResultsPage),
        false
      );
    } else if (user?.links.questionnaireResults !== undefined) {
      this.showPage(user.links.questionnaireResults, true);
    }
  }

  showQuestionnaireResult = (
    resultRef: QuestionnaireResultRef,
    index: number
  ) => {
    this.requestParams.set(constants.selectedQuestionnaireResult, resultRef);
    this.requestParams.set(
      constants.hasOtherQuestionnaireResults,
      this.model.questionnaireResults.length > 1
    );

    if (this.model.questionnaireResults.length === 1) {
      this.router.navigate(
        ['/questionnaire_results/' + index + '/questionnaire_result'],
        {
          replaceUrl: true,
        }
      );
    } else {
      this.router.navigate([
        '/questionnaire_results/' + index + '/questionnaire_result',
      ]);
    }
  };

  nextPage = () => {
    this.model.state = 'Loading';
    const nextUrl = this.model.pagination?.next;
    if (nextUrl) {
      this.showPage(nextUrl, false);
    }
  };

  previousPage = () => {
    this.model.state = 'Loading';
    const previousUrl = this.model.pagination?.previous;
    if (previousUrl) {
      this.showPage(previousUrl, false);
    }
  };

  onSuccess = (
    response: QuestionnaireResults,
    initRequest: boolean,
    resultsUrl: string
  ) => {
    this.model.state = 'Loaded';
    this.model.questionnaireResults = response.results;
    this.model.pagination = response.links;

    if (initRequest && this.model.questionnaireResults.length === 1) {
      this.showQuestionnaireResult(this.model.questionnaireResults[0], 0);
    }
    this.requestParams.set(constants.questionnaireResultsPage, resultsUrl);
  };

  onError = (data: any) => {
    this.model.state = 'Failed';
    console.error(`Failed to load questionnaire results due to error: ${data}`);
  };

  showPage = (resultsUrl: string, initRequest: boolean) =>
    this.questionnaireResultsService
      .list(resultsUrl)
      .then((response: any) => {
        this.onSuccess(response, initRequest, resultsUrl);
      })
      .catch(this.onError);
}

const constants = Object.freeze({
  selectedQuestionnaireResult: 'selectedQuestionnaireResult',
  hasOtherQuestionnaireResults: 'hasOtherQuestionnaireResults',
  questionnaireResultsPage: 'questionnaireResultsPage',
});
