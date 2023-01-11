import { CalendarEvent } from "@app/types/calendar-event.type";
import { SessionType } from "@app/types/calendar-event.type";
import { Component, OnInit } from "@angular/core";
import { CalendarService } from "@services/rest-api-services/calendar.service";
import { StatePassingService } from "@services/state-services/state-passing.service";
import { TranslateService } from "@ngx-translate/core";
import { Utils } from "@services/util-services/util.service";
import { maxTime, isWithinInterval, startOfDay } from "date-fns";

type CalendarItem = {
  date: Date;
  events: (CalendarEvent & { isActive: boolean })[];
};

type model = {
  calendarItems: CalendarItem[];
  state: "Loading" | "Loaded" | "Failed";
};

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.less"],
})
export class CalendarComponent implements OnInit {
  model: model = {
    calendarItems: [],
    state: "Loading",
  };

  constructor(
    private appContext: StatePassingService,
    private translate: TranslateService,
    private calendar: CalendarService,
    private utils: Utils
  ) {}

  addDescription = (event: CalendarEvent) => {
    switch (event.type) {
      case SessionType.IndividualSession: {
        const [clinician] = event.party.clinicians;
        event.description = [
          event.description,
          this.translate.instant(Texts.CalendarWith),
          clinician.firstName,
          clinician.lastName,
        ].join(" ");
        break;
      }
    }
  };

  async ngOnInit() {
    const user = this.appContext.getUser();
    if (user) {
      const events = await this.calendar.list(user);
      events.forEach(this.addDescription);
      const groupedEvents = this.groupByDate(events);
      const calendarItems = this.createCalendarItems(groupedEvents);

      this.model.calendarItems = calendarItems;
      this.model.state = "Loaded";
    } else {
      this.model.state = "Failed";
    }
  }

  private groupByDate(events: CalendarEvent[]): Map<number, CalendarEvent[]> {
    return this.utils.groupBy(events, ({ schedule: { startTime } }) =>
      startOfDay(new Date(startTime)).getTime()
    );
  }

  private createCalendarItems(
    groupedEvents: Iterable<[number | string, CalendarEvent[]]>
  ): CalendarItem[] {
    return Array.from(groupedEvents, ([date, events]) => ({
      date: new Date(date),
      events: this.utils
        .sortBy(events, ({ schedule: { startTime } }) => new Date(startTime))
        .map((event) => ({ ...event, isActive: this.isActive(event) })),
    })).sort(this.utils.compareBy(({ date }) => date));
  }

  isActive({ schedule: { startTime, endTime } }: CalendarEvent) {
    const start = new Date(startTime);
    const end = new Date(endTime || maxTime);
    return isWithinInterval(Date.now(), { start, end });
  }
}

const enum Texts {
  MenuCalendar = "MENU_CALENDAR",
  CalendarWith = "CALENDAR_WITH",
}
