import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FakeStatePassingService,
  selectedCategory,
} from 'src/app/mocks/state-passing-service.mock';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { CategoryLinksComponent } from './category-links.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderModule } from '../../header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { NativeService } from '@services/native-services/native.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@services/state-services/config.service';
import { FakeConfigService } from '@app/mocks/config-service.mock';

class NativeServiceMock extends NativeService {}

describe('CategoryLinksComponent', () => {
  let component: CategoryLinksComponent;
  let fixture: ComponentFixture<CategoryLinksComponent>;
  let nativeService: NativeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        HeaderModule,
      ],
      declarations: [CategoryLinksComponent],
      providers: [
        {
          provide: StatePassingService,
          useValue: new FakeStatePassingService(),
        },
        { provide: ConfigService, useClass: FakeConfigService },
        { provide: NativeService, useValue: new NativeServiceMock() },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    nativeService = TestBed.inject(NativeService);
    fixture = TestBed.createComponent(CategoryLinksComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should get all links for user', () => {
    expect(component.model.name).toEqual(selectedCategory.name);
    expect(component.model.resources).toEqual(selectedCategory.resources);
  });

  it('should open link popup when clicked', () => {
    const linkIndex = 0;
    component.showPopup(linkIndex);
    expect(component.model.showPopup).toEqual(true);
    expect(component.model.currentLink).toEqual(
      component.model.resources[linkIndex].url
    );
  });

  it('should reset current link and flag when clicking back in popup menu', () => {
    const linkIndex = 0;
    component.showPopup(linkIndex);
    component.hidePopup();
    expect(component.model.showPopup).toEqual(false);
    expect(component.model.currentLink).toEqual(undefined);
  });

  it('should change location when clicking continue in popup menu', () => {
    spyOn(nativeService, 'openUrl');

    const linkIndex = 0;
    component.showPopup(linkIndex);
    const selectedUrl = component.model.currentLink;

    component.showLink();

    expect(selectedUrl).toEqual(selectedCategory.resources[linkIndex].url);
    expect(nativeService.openUrl).toHaveBeenCalledWith(selectedUrl);
    expect(component.model.currentLink).toBeUndefined(); // cleared
  });
});
