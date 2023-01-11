import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ERROR_PASS_THROUGH } from "@app/interceptors/interceptor";
import { Observable } from "rxjs";
import { ApiRoot } from "src/app/types/api.type";
import { ConfigService } from "@services/state-services/config.service";
import { calcUrl } from "@utils/environment-utils";

@Injectable({
  providedIn: "root",
})
export class ServerInfoService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  get(): Observable<ApiRoot> {
    const baseUrl = calcUrl(
      this.config.getAppConfig().baseUrl,
      "clinician/api/"
    );
    const context = new HttpContext().set(ERROR_PASS_THROUGH, true);
    return this.http.get<ApiRoot>(baseUrl, { context });
  }
}
