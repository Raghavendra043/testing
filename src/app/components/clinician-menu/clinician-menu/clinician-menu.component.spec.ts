import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { FakeIdle } from "src/app/mocks/idle.mock";
import { Idle } from "@ng-idle/core";
import { ClinicianMenuComponent } from "./clinician-menu.component";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { TranslateModule } from "@ngx-translate/core";
import { ConfigService } from "@services/state-services/config.service";
import { FakeConfigService } from "@app/mocks/config-service.mock";
import { HeaderModule } from "@components/header/header.module";

describe('ClinicianMenuComponent', () => {
  let component: ClinicianMenuComponent;
  let router: Router;
  let fixture: ComponentFixture<ClinicianMenuComponent>;
  let appContext: StatePassingService;

  beforeEach(async () => {
    appContext = new StatePassingService(router);

    await TestBed.configureTestingModule({
      declarations: [ClinicianMenuComponent],
      imports: [
        HttpClientTestingModule,
        HeaderModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: StatePassingService, useValue: appContext },
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: Idle, useClass: FakeIdle },
        { provide: ConfigService, useClass: FakeConfigService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicianMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
