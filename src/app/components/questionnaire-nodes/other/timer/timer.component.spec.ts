import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FakeConfigService } from "@app/mocks/config-service.mock";
import { HeaderModule } from "@components/header/header.module";
import { TranslateModule } from "@ngx-translate/core";
import { ConfigService } from "@services/state-services/config.service";

import { TimerComponent } from "./timer.component";

describe("TimerComponent", () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimerComponent],
      imports: [
        TranslateModule.forRoot(),
        HeaderModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: ConfigService, useValue: FakeConfigService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
