import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OidcInvalidateSsoSessionRoutingModule } from './oidc-invalidate-sso-session-routing.module';
import { OidcInvalidateSsoSessionComponent } from './oidc-invalidate-sso-session/oidc-invalidate-sso-session.component';

@NgModule({
  declarations: [OidcInvalidateSsoSessionComponent],
  imports: [CommonModule, OidcInvalidateSsoSessionRoutingModule],
})
export class OidcInvalidateSsoSessionModule {}
