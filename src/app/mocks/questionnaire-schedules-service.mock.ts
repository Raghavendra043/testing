import { Injectable } from '@angular/core';
import { QuestionnaireScheduleSummary } from '@app/types/questionnaire-schedules.type';
import { Observable, of } from 'rxjs';
import { addDays } from 'date-fns';

Injectable();
export class FakeQuestionnaireScheduleService {
  list(): Observable<QuestionnaireScheduleSummary[]> {
    const now = new Date();
    const tomorrow = addDays(now, 1);
    const questionnaireSchedulesResult = [
      {
        name: 'Blood sugar levels',
        scheduleWindowStart: now,
        nextDeadline: tomorrow,
        questionnaireId: 0,
        reminderStartMinutes: 0,
      },
      {
        name: 'Blood pressure & pulse',
        scheduleWindowStart: now,
        nextDeadline: tomorrow,
        questionnaireId: 0,
        reminderStartMinutes: 0,
      },
    ];
    return of(questionnaireSchedulesResult);
  }
}
