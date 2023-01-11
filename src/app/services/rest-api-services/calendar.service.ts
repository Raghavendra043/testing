import { Injectable } from '@angular/core';
import { User } from '@app/types/user.type';
import { startOfDay } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { CalendarEvent, CalendarResult } from '@app/types/calendar-event.type';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private http: HttpClient) {}

  async list(user: User): Promise<CalendarEvent[]> {
    console.debug('Requesting list of events');

    if (user?.links?.calendar === undefined) {
      throw TypeError(
        'User object does not contain a link relation to calendar'
      );
    }

    const currentDate = startOfDay(new Date());
    const calendarUrl = `${user.links.calendar}?from_date=${currentDate.toISOString}`;
    const { results: events } = await lastValueFrom(
      this.http.get<CalendarResult>(calendarUrl)
    );
    return events;
  }
}
