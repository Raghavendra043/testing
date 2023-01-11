import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OidcResetLoginComponent } from './oidc-reset-login/oidc-reset-login.component';

const routes: Routes = [
  {
    path: '',
    component: OidcResetLoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OidcResetLoginRoutingModule {}
