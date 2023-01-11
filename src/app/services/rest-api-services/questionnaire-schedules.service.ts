import { Injectable } from '@angular/core';
import { Utils } from '@services/util-services/util.service';
import { isSameDay, startOfToday, subMinutes } from 'date-fns';
import { User } from '@app/types/user.type';
import { HttpClient, HttpContext } from '@angular/common/http';
import {
  ERROR_PASS_THROUGH,
  SILENT_REQUEST,
} from '@app/interceptors/interceptor';
import {
  QuestionnaireSchedule,
  QuestionnaireScheduleResults,
  QuestionnaireScheduleSummary,
} from '@app/types/questionnaire-schedules.type';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireSchedulesService {
  constructor(private utils: Utils, private http: HttpClient) {}

  toScheduleSummaries = (result: QuestionnaireScheduleResults) => {
    const questionnaireSchedules = result.questionnaireSchedules;
    const onlyShowOnAnsweringDay = result.onlyShowOnAnsweringDay;
    const today = startOfToday();

    return questionnaireSchedules
      .filter((schedule) => {
        const isOnDeadline =
          this.utils.exists<string>(schedule.nextDeadline) &&
          isSameDay(today, new Date(schedule.nextDeadline));

        return (
          !onlyShowOnAnsweringDay ||
          schedule.type === 'UNSCHEDULED' ||
          isOnDeadline
        );
      })
      .map(this.toSummary);
  };

  private toSummary = (
    schedule: QuestionnaireSchedule
  ): QuestionnaireScheduleSummary => {
    const nextDeadline = this.utils.exists(schedule.nextDeadline)
      ? new Date(schedule.nextDeadline)
      : undefined;

    let scheduleWindowStart;
    if (
      this.utils.exists(nextDeadline) &&
      this.utils.exists(schedule.scheduleWindowMinutes)
    ) {
      scheduleWindowStart = subMinutes(
        nextDeadline,
        schedule.scheduleWindowMinutes
      );
    }

    const [questionnaireId] = schedule.links.questionnaire
      .split('/')
      .reverse()
      .map(Number)
      .filter((id) => !Number.isNaN(id));

    let reminderStartMinutes;
    if (this.utils.exists(schedule.scheduledTime)) {
      reminderStartMinutes = schedule.scheduledTime.reminderStartMinutes;
    }

    return {
      name: schedule.questionnaireName,
      questionnaireId,
      ...(scheduleWindowStart ? { scheduleWindowStart } : {}),
      ...(reminderStartMinutes ? { reminderStartMinutes } : {}),
      ...(nextDeadline ? { nextDeadline } : {}),
    };
  };

  list = (
    user: User,
    errorPassThrough: boolean
  ): Observable<QuestionnaireScheduleSummary[]> => {
    if (!this.utils.exists(user.links.questionnaireSchedules)) {
      throw new TypeError(
        'User object does not contain a link relation to questionnaireSchedules'
      );
    }
    const context = new HttpContext()
      .set(SILENT_REQUEST, true)
      .set(ERROR_PASS_THROUGH, errorPassThrough);

    return this.http
      .get<QuestionnaireScheduleResults>(user.links.questionnaireSchedules, {
        context,
      })
      .pipe(map(this.toScheduleSummaries));
  };
}
