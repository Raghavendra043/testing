import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";;
import { MenuComponent } from "@components/menu/menu/menu.component";
import { TranslateModule } from "@ngx-translate/core";
import { PinCodeLoginComponent } from "./pin-code-login.component";
import { ConfigService } from "@services/state-services/config.service";
import { FakeConfigService } from "@app/mocks/config-service.mock";
import { HeaderModule } from "@components/header/header.module";

describe("PinCodeLoginComponent", () => {
  let component: PinCodeLoginComponent;
  let fixture: ComponentFixture<PinCodeLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuComponent, PinCodeLoginComponent],
      providers: [{ provide: ConfigService, useClass: FakeConfigService }],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule,
        HeaderModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PinCodeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
