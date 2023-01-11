import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
} from "@angular/core";
import { DEFAULT_INTERRUPTSOURCES, Idle } from "@ng-idle/core";
import { TranslateService } from "@ngx-translate/core";
import { ConfigService } from "@services/state-services/config.service";
import { NativeService } from "@services/native-services/native.service";
import { AuthenticationService } from "@services/rest-api-services/authentication.service";
import { FakeNativeLayerService } from "@services/native-services/fake-native-layer.service";
import { Router } from "@angular/router";
import { translationOverrides } from "src/app/product-flavor/translationOverrides";
import { mergeMap, take, tap } from "rxjs/operators";
import { HttpNotificationsService } from "@services/rest-api-services/http-notifications.service";
import { Title } from "@angular/platform-browser";
import { Languages, supportedLanguages } from "./types/product-flavor.type";
import { OidcUtilsService } from "@services/oidc-services/oidc-utils.service";
import moment from "moment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
})
export class AppComponent implements AfterViewInit, OnChanges, OnInit {
  idleState = "NOT_STARTED";
  countdown?: number;
  showSpinner = false;

  constructor(
    public translate: TranslateService,
    private config: ConfigService,
    private idle: Idle,
    private native: NativeService,
    private cdr: ChangeDetectorRef,
    private authentication: AuthenticationService,
    private router: Router,
    public _router: Router,
    private httpNotifications: HttpNotificationsService,
    private title: Title,
    private oidcService: OidcUtilsService,
    private fakeNativeLayer: FakeNativeLayerService // fakeNative is not unused. Is toggled in app.config.json
  ) {}

  ngOnChanges(): void {
    this.runLanguageController();
    console.debug("Config loaded!");
  }

  ngOnInit() {
    this.title.setTitle("opentele-client-html-angular");

    this.setupNativeInteroperability();

    if (this.config.getOIDCConfig().enabled) {
      console.debug("OIDC enabled");
      this.oidcService.runOIDC();
    } else {
      console.debug("OIDC disabled");
    }

    this.runLanguageController();
    this.initializeUserIdleEvents();
    this.initializeAppLifeCycleEvents();
  }

  ngAfterViewInit() {
    this.httpNotifications.httpProgress().subscribe((status) => {
      this.showSpinner = status;
      this.cdr.detectChanges();
    });
  }

  private determineLocale(language: string): string {
    const locale = language.slice(0, 2);
    if (locale === "en") {
      return language;
    } else if (locale === "no") {
      return "nb";
    } else {
      return locale;
    }
  }

  runLanguageController() {
    this.translate.setDefaultLang(Languages.EN_US);
    const languages = supportedLanguages;

    const applyTranslationOverrides = (language: string) => {
      if (language in translationOverrides) {
        this.translate
          .getTranslation(language)
          .pipe(
            mergeMap(() => {
              this.translate.setTranslation(
                language,
                translationOverrides[language],
                true
              );
              return this.translate.get("OPENTELE");
            }),
            take(1),
            tap((title) => console.debug("Title: %s", title))
          )
          .subscribe((title: string) => this.title.setTitle(title));
      }
    };

    const [language] = navigator.languages || [navigator.language || "en"];
    console.debug(`Browser language: ${language}`);

    const setLocale = (language: string) => {
      console.debug(`Setting language to: ${language}`);
      this.translate.use(language);

      const languagesToOverride = Object.keys(translationOverrides);
      if (languagesToOverride.length) {
        languagesToOverride.forEach(applyTranslationOverrides);
      }

      this.translate
        .get("OPENTELE")
        .subscribe((title: string) => this.title.setTitle(title));

      const locale = this.determineLocale(language);
      console.debug(`Setting locale for moment: ${locale}`);
      moment.locale(locale);
    };

    const sharesPrefix = (lang1: string, lang2: string) => {
      return lang1.slice(0, 2) === lang2.slice(0, 2);
    };

    const overrideLanguage = (language: string) => {
      const overrides: Record<string, string> = {
        nb: "no-NO",
        "nb-no": "no-NO",
      };

      if (language.toLowerCase() in overrides) {
        console.info(
          `Language overridden from ${language} to ${
            overrides[language.toLowerCase()]
          }`
        );
        return overrides[language.toLowerCase()];
      }
      return language;
    };

    const changeLocale = (browserLanguage: string) => {
      const language = overrideLanguage(browserLanguage);

      // exact match
      if (languages.includes(language)) {
        console.info("Setting language from exact match of: " + language);
        setLocale(language);
        return;
      }

      // prefix match
      for (const knownLanguage of languages) {
        if (sharesPrefix(knownLanguage, language)) {
          console.info(
            "Setting language from shared prefix match of: " +
              language +
              " which matches: " +
              knownLanguage
          );
          setLocale(knownLanguage);
          return;
        }
      }

      // default
      console.info(
        "Setting language to default en-US. Unable to match language: " +
          language
      );
      setLocale("en-US");
    };

    changeLocale(language);
  }

  prefix = (lang: string) => lang.slice(0, 2);

  setupNativeInteroperability = () => {
    this.native.enableMessagesFromNative();
    console.info("Integration with native layer enabled");
  };

  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    delete this.countdown;
  }

  initializeUserIdleEvents = () => {
    this.idle.setIdle(this.config.getAppConfig().idleTimeoutInSeconds);
    this.idle.setTimeout(
      this.config.getAppConfig().idleWarningCountdownInSeconds
    );
    this.idle.setKeepaliveEnabled(false);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
    });

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      delete this.countdown;
      console.debug(`${this.idleState} ${new Date()}`);
      this.cdr.detectChanges();
    });

    this.idle.onTimeoutWarning.subscribe((seconds) => {
      this.idleState = "IDLE_WARNING";
      this.countdown = seconds;
      console.debug("Idle countdown: ", this.countdown);
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = "TIMED_OUT";
      delete this.countdown;
      console.info("User idle and logged out");
      this.authentication.authTimedOut();
      this.router.navigate(["/login"]);
    });
  };

  initializeAppLifeCycleEvents = () => {
    const appCreated = () => console.info("App created");

    const appResumed = () => {
      console.info("App resumed");
      this.idle.interrupt();
    };

    this.native.subscribeToMultipleMessages("appCreatedEvent", appCreated);
    this.native.subscribeToMultipleMessages("appResumedEvent", appResumed);
  };
}
