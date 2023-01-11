import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { FakeConfigService } from "@app/mocks/config-service.mock";
import { ConfigService } from "@services/state-services/config.service";
import { Idp2Service } from "./idp2.service";

describe("Idp2Service", () => {
  let service: Idp2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ConfigService, useClass: FakeConfigService }],
    });
    service = TestBed.inject(Idp2Service);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
