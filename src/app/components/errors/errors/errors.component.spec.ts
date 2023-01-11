import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule } from "@ngx-translate/core";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { ErrorsComponent } from "./errors.component";
import { Location } from "@angular/common";
import { HeaderModule } from "../../header/header.module";
import { FakeStatePassingService } from "src/app/mocks/state-passing-service.mock";
import { MenuComponent } from "../../menu/menu/menu.component";
import { ConfigService } from "@services/state-services/config.service";
import { FakeConfigService } from "@app/mocks/config-service.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("ErrorsComponent", () => {
  let component: ErrorsComponent;
  let fixture: ComponentFixture<ErrorsComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useClass: FakeConfigService },
        {
          provide: StatePassingService,
          useValue: new FakeStatePassingService(),
        },
      ],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        HeaderModule,
        RouterTestingModule.withRoutes(
          //TODO: Should ideally be imported but relative path can't match
          [
            {
              path: "error",
              component: ErrorsComponent,
            },
            {
              path: "menu",
              component: MenuComponent,
            },
          ]
        ),
      ],
      declarations: [ErrorsComponent, MenuComponent],
    }).compileComponents();
  });

  beforeEach((done: DoneFn) => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(ErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router.initialNavigation();
    done();
  });

  it("should set error text", () => {
    expect(component.model.description).toMatch(/RUNTIME_ERROR/);
  });

  it("should redirect to login", fakeAsync(() => {
    component.leaveErrorPage();
    fixture.detectChanges();
    tick();
    expect(location.path()).toBe("/menu");
  }));

  //   it('should log exception to $log', () => { // TODO: Is this obsolete?
  //     var expectedLogEntry = JSON.stringify(
  //       appContext.requestParams.get('exception')
  //     );
  //     // runController();
  //     expect(log.error.logs[0]).toMatch(new RegExp(expectedLogEntry));
  //   });
});
