import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OidcLogoutRoutingModule } from './oidc-logout-routing.module';
import { OidcLogoutComponent } from './oidc-logout/oidc-logout.component';

@NgModule({
  declarations: [OidcLogoutComponent],
  imports: [CommonModule, OidcLogoutRoutingModule],
})
export class OidcLogoutModule {}
