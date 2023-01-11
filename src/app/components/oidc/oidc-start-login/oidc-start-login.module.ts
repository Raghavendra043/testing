import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OidcStartLoginRoutingModule } from './oidc-start-login-routing.module';
import { OidcStartLoginComponent } from './oidc-start-login/oidc-start-login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../../header/header.module';

@NgModule({
  declarations: [OidcStartLoginComponent],
  imports: [
    CommonModule,
    OidcStartLoginRoutingModule,
    SharedModule,
    HeaderModule,
  ],
})
export class OidcStartLoginModule {}
