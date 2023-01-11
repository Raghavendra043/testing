import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OidcInvalidateSsoSessionComponent } from './oidc-invalidate-sso-session/oidc-invalidate-sso-session.component';

const routes: Routes = [
  {
    path: '',
    component: OidcInvalidateSsoSessionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OidcInvalidateSsoSessionRoutingModule {}
