import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { QuestionnaireResultsService } from "./questionnaire-results.service";
import { HttpClient, HttpResponse, HttpEventType } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

describe("QuestionnaireResultsService", () => {
  let service: QuestionnaireResultsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClient],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(QuestionnaireResultsService);
  });

  it("should be created", fakeAsync(() => {
    expect(service).toBeTruthy();
  }));
});
