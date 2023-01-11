import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpNotificationsService } from "@services/rest-api-services/http-notifications.service";
import { StatePassingService } from "@services/state-services/state-passing.service";
import { Observable } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";

export const ERROR_PASS_THROUGH = new HttpContextToken(() => false);
export const SILENT_REQUEST = new HttpContextToken(() => false);
export const ALLOW_TIMEOUT = new HttpContextToken(() => false);

@Injectable()
export class Interceptor implements HttpInterceptor {
  count = 0;

  constructor(
    private appContext: StatePassingService,
    private router: Router,
    private httpNotificationsProvider: HttpNotificationsService
  ) {
    this.router.onSameUrlNavigation = "reload";
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const options = {
      silentRequest: req.context.get(SILENT_REQUEST),
      errorPassThrough: req.context.get(ERROR_PASS_THROUGH),
      allowTimeout: req.context.get(ALLOW_TIMEOUT),
    };

    if (!options.silentRequest && this.count === 0) {
      this.httpNotificationsProvider.fireRequestStarted(req);
      this.httpNotificationsProvider.setHttpProgressStatus(true);
    }
    this.count++;

    return next.handle(req).pipe(
      tap(this.httpNotificationsProvider.fireRequestEnded),
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          this.responseError(error, options);
        }
        this.httpNotificationsProvider.fireRequestEnded(error);
        console.error(`Interceptor, catchError: ${JSON.stringify(error)}`);
        throw error;
      }),
      finalize(() => {
        this.count--;
        if (this.count === 0) {
          this.httpNotificationsProvider.setHttpProgressStatus(false);
        }
      })
    );
  }

  responseError(response: HttpErrorResponse, options: Options) {
    const status = response.status;

    console.error(
      `HTTP request to: ${response.url}, failed with status code: ${status}`
    );

    if (options.errorPassThrough) {
      console.info(
        "HTTP error pass through enabled, skipping error interceptor logic."
      );
    } else if (status === 401) {
      localStorage.removeItem("authToken");
      this.sendToLoginPage();
      this.appContext.requestParams.set("authenticationError", "LOGGED_OUT");
    } else if (!options.allowTimeout || status !== 0) {
      this.appContext.requestParams.set("exception", { code: 0 });
      void this.router.navigate(["error"]);
    }
    throw response;
  }

  private sendToLoginPage() {
    const customUrl = sessionStorage.getItem("loginUrl");
    if (customUrl !== null) {
      void this.router.navigateByUrl(customUrl);
    } else {
      if (this.router.url === "/login") {
        void this.router.navigateByUrl("/", { skipLocationChange: true });
      }
      void this.router.navigate(["login"]);
    }
  }
}

type ContextType<T> = T extends HttpContextToken<infer U> ? U : never;

type Options = {
  errorPassThrough: ContextType<typeof ERROR_PASS_THROUGH>;
  silentRequest: ContextType<typeof SILENT_REQUEST>;
  allowTimeout: ContextType<typeof ALLOW_TIMEOUT>;
};
