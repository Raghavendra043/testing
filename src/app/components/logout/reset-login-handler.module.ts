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
      useFactory: configResetLoginRoutes,
      deps: [ConfigService],
      multi: true,
    },
  ],
})
export class ResetLoginHandlerModule {}

export function configResetLoginRoutes(config: ConfigService) {
  let routes: Routes = [];

  if (config.getOIDCConfig().enabled) {
    routes = [
      {
        path: "",
        loadChildren: () =>
          import("../oidc/oidc-reset-login/oidc-reset-login.module").then(
            (m) => m.OidcResetLoginModule
          ),
      },
    ];
  } else {
    routes = [
      {
        path: "",
        loadChildren: () =>
          import("./logout.module").then((m) => m.LogoutModule),
      },
    ];
  }

  return routes;
}
