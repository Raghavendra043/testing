import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OidcLoginSuccessComponent } from './oidc-login-success/oidc-login-success.component';

const routes: Routes = [
  {
    path: '',
    component: OidcLoginSuccessComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OidcLoginSuccessRoutingModule {}
