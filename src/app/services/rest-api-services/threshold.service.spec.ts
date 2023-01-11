import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FakeConfigService } from '@app/mocks/config-service.mock';
import { ConfigService } from '@services/state-services/config.service';

import { ThresholdService } from './threshold.service';

describe('ThresholdService', () => {
  let service: ThresholdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ConfigService, useClass: FakeConfigService }],
    });
    service = TestBed.inject(ThresholdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
