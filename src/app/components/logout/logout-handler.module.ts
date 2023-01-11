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
      useFactory: configLogoutRoutes,
      deps: [ConfigService],
      multi: true,
    },
  ],
})
export class LogoutHandlerModule {}

export function configLogoutRoutes(config: ConfigService) {
  let routes: Routes = [];

  if (config.getOIDCConfig().enabled) {
    routes = [
      {
        path: "",
        loadChildren: () =>
          import("../oidc/oidc-logout/oidc-logout.module").then(
            (m) => m.OidcLogoutModule
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
