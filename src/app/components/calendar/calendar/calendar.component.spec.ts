import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateModule } from "@ngx-translate/core";
import { FakeCalendarService } from "src/app/mocks/calendar-service.mock";
import { FakeStatePassingService } from "src/app/mocks/state-passing-service.mock";
import { CalendarService } from "src/app/services/rest-api-services/calendar.service";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { HeaderModule } from "../../header/header.module";
import { LoadingModule } from "../../loading/loading.module";
import { CalendarComponent } from "./calendar.component";
import { ConfigService } from "@services/state-services/config.service";
import { FakeConfigService } from "@app/mocks/config-service.mock";

const calendarResult = [
  {
    description: "follow up with Helen Anderson",
    links: {
      event: "https://ode-demo.oth.io/calendar/events/5",
      origin: "https://ode-demo.oth.io/meetings/individual-sessions/18",
    },
    party: {
      clinicians: [
        {
          email: "helen@hospital.dk",
          firstName: "Helen",
          lastName: "Anderson",
          links: {
            clinician: "https://ode-demo.oth.io/clinician/api/clinicians/2",
          },
          username: "HelenAnderson",
        },
      ],
      patients: [
        {
          firstName: "Nancy Ann",
          lastName: "Doe",
          links: {
            patient: "https://ode-demo.oth.io/clinician/api/patients/13",
          },
          uniqueId: "17079421073",
          username: "NancyAnn",
        },
      ],
    },
    schedule: {
      startTime: "2020-05-29T08:00:00Z",
    },
    type: "individual_session",
  },
  {
    description: "health check with Helen Anderson",
    links: {
      event: "https://ode-demo.oth.io/calendar/events/5",
      origin: "https://ode-demo.oth.io/meetings/individual-sessions/18",
    },
    party: {
      clinicians: [
        {
          email: "helen@hospital.dk",
          firstName: "Helen",
          lastName: "Anderson",
          links: {
            clinician: "https://ode-demo.oth.io/clinician/api/clinicians/2",
          },
          username: "HelenAnderson",
        },
      ],
      patients: [
        {
          firstName: "Nancy Ann",
          lastName: "Doe",
          links: {
            patient: "https://ode-demo.oth.io/clinician/api/patients/13",
          },
          uniqueId: "17079421073",
          username: "NancyAnn",
        },
      ],
    },
    schedule: {
      startTime: "2020-04-22T08:00:00Z",
    },
    type: "individual_session",
  },
];

describe("CalendarComponent", () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarComponent],
      providers: [
        { provide: ConfigService, useClass: FakeConfigService },
        { provide: StatePassingService, useClass: FakeStatePassingService },
        {
          provide: CalendarService,
          useValue: new FakeCalendarService(calendarResult),
        },
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        HeaderModule,
        HttpClientTestingModule,
        LoadingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be defined", () => {
    expect(component).toBeTruthy();
  });

  it("should group upcoming events by date", () => {
    expect(component.model.calendarItems).toBeDefined();
    const calendarItems = component.model.calendarItems;

    expect(calendarItems.length).toEqual(2);

    const item0 = calendarItems[0];
    expect(item0.events.length).toEqual(1);

    const event0 = item0.events[0];
    expect(event0.type).toEqual("individual_session");
    expect(event0.description).toBeDefined();
  });
});
