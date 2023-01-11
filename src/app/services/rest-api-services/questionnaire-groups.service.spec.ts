import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { QuestionnaireGroupsService } from "./questionnaire-groups.service";
import { ConfigService } from "@services/state-services/config.service";
import { FakeConfigService } from "@app/mocks/config-service.mock";

describe("QuestionnaireGroupsService", () => {
  let service: QuestionnaireGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ConfigService, useClass: FakeConfigService }],
    });
    service = TestBed.inject(QuestionnaireGroupsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
