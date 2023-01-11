import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OidcLoginSuccessRoutingModule } from './oidc-login-success-routing.module';
import { OidcLoginSuccessComponent } from './oidc-login-success/oidc-login-success.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../../header/header.module';

@NgModule({
  declarations: [OidcLoginSuccessComponent],
  imports: [
    CommonModule,
    OidcLoginSuccessRoutingModule,
    SharedModule,
    HeaderModule,
  ],
})
export class OidcLoginSuccessModule {}
