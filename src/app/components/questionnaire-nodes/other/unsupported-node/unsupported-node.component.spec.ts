import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FakeConfigService } from '@app/mocks/config-service.mock';
import { AppConfig, OIDCConfig } from '@app/types/config.type';
import { HeaderModule } from '@components/header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigService } from '@services/state-services/config.service';

import { UnsupportedNodeComponent } from './unsupported-node.component';

describe('UnsupportedNodeComponent', () => {
  let component: UnsupportedNodeComponent;
  let fixture: ComponentFixture<UnsupportedNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HeaderModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: ConfigService, useValue: FakeConfigService }],
      declarations: [UnsupportedNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnsupportedNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
