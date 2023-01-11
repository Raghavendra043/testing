import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { StatePassingService } from "./state-passing.service";
import { UserSessionService } from "./user-session.service";

describe("UserSessionService", () => {
  let service: UserSessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: StatePassingService, useValue: undefined }],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(UserSessionService);
  });

  it("should be created", () => {
    expect(service).toBeDefined();
  });
});
