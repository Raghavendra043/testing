import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CreatePatientComponent } from './create-patient.component';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigService } from '@services/state-services/config.service';
import { FakeConfigService } from '@app/mocks/config-service.mock';
import { mockUser } from '@app/mocks/state-passing-service.mock';
import { HeaderModule } from '@components/header/header.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ThresholdService } from '@services/rest-api-services/threshold.service';
import { ElementRef } from '@angular/core';

describe('CreatePatientComponent', () => {
  let component: CreatePatientComponent;
  let router: Router;
  let fixture: ComponentFixture<CreatePatientComponent>;
  let appContext: StatePassingService;

  beforeEach(async () => {
    appContext = new StatePassingService(router);

    appContext.currentUser.set(mockUser);

    await TestBed.configureTestingModule({
      declarations: [CreatePatientComponent],
      imports: [
        HttpClientTestingModule,
        HeaderModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        NgMultiSelectDropDownModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: StatePassingService, useValue: appContext },
        { provide: ConfigService, useClass: FakeConfigService },
        ThresholdService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
