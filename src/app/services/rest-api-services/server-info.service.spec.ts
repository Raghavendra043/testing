import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ServerInfoService } from "./server-info.service";
import { ConfigService } from "@services/state-services/config.service";
import { FakeConfigService } from "@app/mocks/config-service.mock";

describe("ServerInfoService", () => {
  let service: ServerInfoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ConfigService, useClass: FakeConfigService }],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ServerInfoService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeDefined();
  });

  it("should get server info", () => {
    const info = {
      version: "BUILD-208_2014-09-23_00-18-50",
      minimumRequiredClientVersion: "1.23.0",
      serverEnvironment: "development",
    };

    const data: unknown[] = [];
    service.get().subscribe({
      next: (response: unknown) => {
        data.push(response);
      },
    });
    httpTestingController
      .expectOne("http://localhost:7000/clinician/api/")
      .flush(info);

    expect(data).toEqual([info]);
  });

  it("should propagate errors back to caller", () => {
    const statusCodes: number[] = [];
    const successes: boolean[] = [];

    service.get().subscribe({
      next: () => {
        successes.push(true);
      },
      error: ({ status }) => {
        successes.push(false);
        statusCodes.push(status);
      },
    });

    httpTestingController
      .expectOne("http://localhost:7000/clinician/api/")
      .flush(
        {},
        {
          status: 0,
          statusText: "Error",
        }
      );

    expect(successes).toEqual([false]);
    expect(statusCodes).toEqual([0]);
  });
});
