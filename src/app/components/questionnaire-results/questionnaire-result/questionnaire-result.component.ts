import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { QuestionnaireResultsService } from "@services/rest-api-services/questionnaire-results.service";
import { StatePassingService } from "@services/state-services/state-passing.service";
import { ConfigService } from "@services/state-services/config.service";
import {
  Measurement,
  MeasurementsReply,
  Question,
  QuestionnaireResult,
  QuestionnaireResultRef,
} from "@app/types/questionnaire-results.type";
import { LoadingState } from "@app/types/loading.type";

@Component({
  selector: "app-questionnaire-result",
  templateUrl: "./questionnaire-result.component.html",
  styleUrls: ["./questionnaire-result.component.less"],
})
export class QuestionnaireResultComponent implements OnInit {
  questionnaireResult: QuestionnaireResult | undefined;
  popUpQuestion?: Question &
    Required<Pick<Measurement, "comment" | "timestamp">>;
  state: LoadingState = "Loading";
  readonly hasOtherResults: boolean;
  readonly showSeverity: boolean;

  constructor(
    private appContext: StatePassingService,
    private config: ConfigService,
    private questionnaireResultsService: QuestionnaireResultsService,
    private router: Router
  ) {
    const params = this.appContext.requestParams;

    this.hasOtherResults = params.get(
      constants.hasOtherQuestionnaireResults
    ) as boolean;

    this.showSeverity = this.config.getAppConfig().showSeverity;

    const questionnaireResultRef = params.get(
      constants.selectedQuestionnaireResult
    ) as QuestionnaireResultRef;

    this.questionnaireResultsService
      .show(questionnaireResultRef)
      .then((result: QuestionnaireResult) => {
        this.questionnaireResult = result;
        this.state = "Loaded";
        return result;
      })
      .catch((error) => {
        this.state = "Failed";
        console.error(
          `Failed to load questionnaire result due to error: ${error}`
        );
        return undefined;
      });
  }

  ngOnInit() {
    const params = this.appContext.requestParams;
    if (!params.containsKey(constants.selectedQuestionnaireResult)) {
      this.router.navigate(["/menu"]);
    }
  }

  showPopUp(question: Question) {
    if (this.hasMeasurementReply(question)) {
      const comment = this.timestampedComment(question.reply);
      if (comment !== undefined) {
        // @ts-ignore
        this.popUpQuestion = { ...question, ...comment };
      }
    }
  }

  hidePopUp() {
    delete this.popUpQuestion;
  }

  private hasMeasurementReply(
    question: Question
  ): question is Question & { reply: MeasurementsReply } {
    return (question.reply as MeasurementsReply).measurements !== undefined;
  }

  private timestampedComment(reply: MeasurementsReply) {
    const m = reply.measurements.find(this.hasComment);
    return m && { comment: m.comment, timestamp: m.timestamp };
  }

  hasComment(measurement: any) {
    return measurement.comment !== undefined && measurement.comment !== "";
  }
}

const constants = Object.freeze({
  selectedQuestionnaireResult: "selectedQuestionnaireResult",
  hasOtherQuestionnaireResults: "hasOtherQuestionnaireResults",
});
