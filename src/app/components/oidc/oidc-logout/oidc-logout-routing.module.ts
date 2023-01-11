import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OidcLogoutComponent } from './oidc-logout/oidc-logout.component';

const routes: Routes = [
  {
    path: '',
    component: OidcLogoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OidcLogoutRoutingModule {}
