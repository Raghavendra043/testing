import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { OtherQuestionnairesComponent } from './other-questionnaires.component';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigService } from '@services/state-services/config.service';
import { FakeConfigService } from '@app/mocks/config-service.mock';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HeaderModule } from '@components/header/header.module';

describe('OtherQuestionnairesComponent', () => {
  let component: OtherQuestionnairesComponent;
  let fixture: ComponentFixture<OtherQuestionnairesComponent>;
  let appContext: StatePassingService;
  let router: Router;

  beforeEach(async () => {
    appContext = new StatePassingService(router);
    const user: any = { firstName: 'Test', lastName: 'Testerson' };
    appContext.currentUser.set(user);

    await TestBed.configureTestingModule({
      declarations: [OtherQuestionnairesComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        NgMultiSelectDropDownModule,
        HeaderModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: StatePassingService, useValue: appContext },
        { provide: ConfigService, useClass: FakeConfigService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OtherQuestionnairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
