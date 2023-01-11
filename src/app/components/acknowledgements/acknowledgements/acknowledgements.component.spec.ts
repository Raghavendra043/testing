import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AcknowledgementsComponent } from "./acknowledgements.component";
import { AcknowledgementsService } from "@services/rest-api-services/acknowledgements.service";
import { StatePassingService } from "@services/state-services/state-passing.service";
import { TranslateModule } from "@ngx-translate/core";
import { FakeAcknowledgementsService } from "@app/mocks/rest-service.mock";
import { FakeStatePassingService } from "@app/mocks/state-passing-service.mock";
import { HeaderModule } from "@components/header/header.module";
import { RouterTestingModule } from "@angular/router/testing";
import { LoadingModule } from "@components/loading/loading.module";
import { ConfigService } from "@services/state-services/config.service";
import { FakeConfigService } from "@app/mocks/config-service.mock";

const restServiceResult = [
  {
    name: "questionnaire 1",
    type: "questionnaire",
    uploadTimestamp: "2022-10-03T09:28:09.000Z",
    acknowledgementTimestamp: "2022-10-03T11:37:14.000Z",
    links: {
      questionnaireResult:
        "https://ode-demo.oth.io/clinician/api/patients/1/questionnaire-results/205",
    },
    message:
      "Dine data fra spørgeskemaet Hæmoglobin indhold i blod " +
      "indsendt d. 13-10-2014 kl. 10:29 er set og godkendt d. " +
      "15-11-2014 kl. 16:39.",
  },
  {
    name: "questionnaire 2",
    type: "questionnaire",
    uploadTimestamp: "2022-10-03T09:29:52.000Z",
    acknowledgementTimestamp: "2022-10-03T11:36:19.000Z",
    links: {
      questionnaireResult:
        "https://ode-demo.oth.io/clinician/api/patients/1/questionnaire-results/204",
    },
    message:
      "Dine data fra spørgeskemaet Lunger indhold i blod " +
      "indsendt d. 27-03-2012 kl. 09:54 er set og godkendt d. " +
      "06-07-2013 kl. 15:21.",
  },
  {
    name: "questionnaire 3",
    type: "questionnaire",
    uploadTimestamp: "2022-10-03T09:29:52.000Z",
    acknowledgementTimestamp: "2022-10-03T11:36:19.000Z",
    links: {
      questionnaireResult:
        "https://ode-demo.oth.io/clinician/api/patients/1/questionnaire-results/201",
    },
    message:
      "Dine data fra spørgeskemaet Blodsukker indsendt d. " +
      "05-01-2010 kl. 15:10 er set og godkendt d. 09-02-2014 kl." +
      " 21:15.",
  },
];

describe("AcknowledgementsComponent", () => {
  let component: AcknowledgementsComponent;
  let fixture: ComponentFixture<AcknowledgementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcknowledgementsComponent],

      providers: [
        { provide: ConfigService, useValue: new FakeConfigService() },
        {
          provide: StatePassingService,
          useValue: new FakeStatePassingService(),
        },
        {
          provide: AcknowledgementsService,
          useValue: new FakeAcknowledgementsService(restServiceResult),
        },
      ],
      imports: [
        TranslateModule.forRoot(),
        HeaderModule,
        RouterTestingModule,
        HttpClientTestingModule,
        LoadingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AcknowledgementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be defined", () => {
    expect(component).toBeTruthy();
  });

  it("should get all acknowledgements for user", () => {
    expect(component.model.acknowledgements.length).toEqual(3);
    expect(component.model.acknowledgements).toEqual(
      //@ts-ignore
      restServiceResult
    );
  });
});
