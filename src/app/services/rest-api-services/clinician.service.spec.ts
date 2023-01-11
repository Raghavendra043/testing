import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ClinicianService } from "./clinician.service";

describe("ClinicianService", () => {
  let service: ClinicianService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ClinicianService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
