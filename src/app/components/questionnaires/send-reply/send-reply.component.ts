import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionnairesService } from 'src/app/services/rest-api-services/questionnaires.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { NativeService } from 'src/app/services/native-services/native.service';
import { QuestionnaireState } from 'src/app/types/parser.type';

@Component({
  selector: 'app-send-reply',
  templateUrl: './send-reply.component.html',
  styleUrls: ['./send-reply.component.less'],
})
export class SendReplyComponent {
  sendReplyState = SendReplyState; // expose enum to template

  model: { title: string; state: SendReplyState } = {
    title: 'SEND_REPLIES_TITLE',
    state: SendReplyState.CONFIRM,
  };
  questionnaireState!: QuestionnaireState;

  constructor(
    private appContext: StatePassingService,
    private questionnaires: QuestionnairesService,
    private native: NativeService,
    private router: Router
  ) {
    if (!this.appContext.requestParams.containsKey(QUESTIONNAIRE_STATE)) {
      this.router.navigate(['/menu']);
      return;
    }
    this.questionnaireState =
      this.appContext.requestParams.getAndClear<QuestionnaireState>(
        QUESTIONNAIRE_STATE
      );
  }

  skipSendClick = (): void => {
    this.router.navigate(['/menu']);
  };

  extractQuestionnaireId = (url: string): number => {
    const segments: string[] = url.split('/').reverse();
    const idPart = segments.find((e: string) => !isNaN(Number(e)));
    return Number(idPart);
  };

  sendClick = (): void => {
    this.model.title = 'UPLOADING_REPLIES_TEXT';
    this.model.state = SendReplyState.UPLOADING;

    this.questionnaires
      .replyTo(
        this.questionnaireState.questionnaire,
        this.questionnaireState.outputs
      )
      .then(
        () => {
          this.model.title = 'SEND_REPLIES_TITLE';
          this.model.state = SendReplyState.ACKNOWLEDGE;

          const questionnaireId = this.extractQuestionnaireId(
            this.questionnaireState.questionnaire.links.questionnaireResult
          );
          const clearSchedulesRequestDelivered =
            this.native.clearScheduledQuestionnaire(questionnaireId);
          if (!clearSchedulesRequestDelivered) {
            console.debug(
              "Couldn't deliver clear schedules request due to missing native layer"
            );
          }
        },
        () => {
          this.model.title = 'ERROR_TITLE';
          this.model.state = SendReplyState.FAILED;
        }
      )
      .catch(() => {
        this.model.title = 'ERROR_TITLE';
        this.model.state = SendReplyState.FAILED;
      });
  };

  ackOkClick = () => {
    this.router.navigate(['/menu']);
  };

  cancelRetryClick = () => {
    this.router.navigate(['/menu']);
  };

  goBack = () => {
    this.appContext.requestParams.set(
      SELECTED_QUESTIONNAIRE,
      this.questionnaireState.questionnaireRef
    );

    this.appContext.requestParams.set(
      QUESTIONNAIRE_STATE,
      this.questionnaireState
    );
    globalThis.history.back();
  };
}

const QUESTIONNAIRE_STATE = 'questionnaireState';
const SELECTED_QUESTIONNAIRE = 'selectedQuestionnaire';

export enum SendReplyState {
  CONFIRM,
  UPLOADING,
  ACKNOWLEDGE,
  FAILED,
}
