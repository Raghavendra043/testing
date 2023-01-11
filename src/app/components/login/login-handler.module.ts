import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ROUTES, RouterModule, Routes } from "@angular/router";
import { ConfigService } from "@services/state-services/config.service";

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: configLoginRoutes,
      deps: [ConfigService],
      multi: true,
    },
  ],
})
export class LoginHandlerModule {}

export function configLoginRoutes(config: ConfigService) {
  let routes: Routes = [];
  if (config.getOIDCConfig().enabled) {
    routes = [
      {
        path: "",
        loadChildren: () =>
          import("../oidc/oidc-start-login/oidc-start-login.module").then(
            (m) => m.OidcStartLoginModule
          ),
      },
    ];
  } else {
    routes = [
      {
        path: "",
        loadChildren: () => import("./login.module").then((m) => m.LoginModule),
      },
    ];
  }
  return routes;
}
