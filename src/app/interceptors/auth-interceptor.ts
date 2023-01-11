import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StatePassingService } from "@services/state-services/state-passing.service";
import { Utils } from "@services/util-services/util.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private appContext: StatePassingService, private utils: Utils) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const useDefaultAuth = this.appContext.requestParams.get(
      'useDefaultAuth'
    ) as boolean;

    const authorization = this.appContext.requestParams.get(
      "authorizationHeader"
    ) as string;

    const patientAuthorization = this.appContext.requestParams.get(
      'patientAuthorizationHeader'
    ) as string;
    let clone;

    if (useDefaultAuth && this.utils.exists(authorization)) {
      clone = request.clone({
        setHeaders: { Authorization: authorization },
      });
      return next.handle(clone);
    } else {
      if (
        this.utils.exists(authorization) &&
        !this.alreadyHasAuthHeaders(request)
      ) {
        if (this.utils.exists(patientAuthorization)) {
          clone = request.clone({
            setHeaders: { Authorization: patientAuthorization },
          });
        } else {
          clone = request.clone({
            setHeaders: { Authorization: authorization },
          });
        }
        return next.handle(clone);
      } else {
        return next.handle(request);
      }
    }
  }

  private alreadyHasAuthHeaders(request: HttpRequest<unknown>): boolean {
    return request.headers.has("authorization");
  }
}
