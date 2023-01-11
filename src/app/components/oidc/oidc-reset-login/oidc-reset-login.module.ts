import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OidcResetLoginRoutingModule } from './oidc-reset-login-routing.module';
import { OidcResetLoginComponent } from './oidc-reset-login/oidc-reset-login.component';

@NgModule({
  declarations: [OidcResetLoginComponent],
  imports: [CommonModule, OidcResetLoginRoutingModule],
})
export class OidcResetLoginModule {}
