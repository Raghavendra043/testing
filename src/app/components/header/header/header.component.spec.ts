import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FakeStatePassingService } from 'src/app/mocks/state-passing-service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NativeService } from 'src/app/services/native-services/native.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { LogoutComponent } from '../../logout/logout/logout.component';
import { HeaderComponent } from './header.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, LogoutComponent],
      providers: [
        { provide: StatePassingService, useValue: FakeStatePassingService },
        { provice: NativeService, useValue: new NativeService() },
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'logout',
            component: LogoutComponent,
          },
        ]),
      ],
    }).compileComponents();
  });

  beforeEach((done: DoneFn) => {
    // @ts-ignore
    globalThis = {
      confirm: (url: string) => {},
    };
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router.initialNavigation();
    done();
  });

  it('should redirect to logout page', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const navigateSpy = spyOn(router, 'navigate');
    spyOn(globalThis, 'confirm').and.callFake(() => {
      return true;
    });
    component.goLogout();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(navigateSpy).toHaveBeenCalledWith(['/logout']);
  });
});
