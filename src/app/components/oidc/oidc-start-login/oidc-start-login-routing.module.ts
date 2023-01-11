import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OidcStartLoginComponent } from './oidc-start-login/oidc-start-login.component';

const routes: Routes = [
  {
    path: '',
    component: OidcStartLoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OidcStartLoginRoutingModule {}
