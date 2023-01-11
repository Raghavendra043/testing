import { Component, OnInit } from '@angular/core';
import { OidcUtilsService } from 'src/app/services/oidc-services/oidc-utils.service';
import { OIDC_CONTINUE_WITH_ID } from '@utils/globals';
import { lastValueFrom } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'oidc-invalidate-sso-session',
  templateUrl: './oidc-invalidate-sso-session.component.html',
  styleUrls: ['./oidc-invalidate-sso-session.component.less'],
})
export class OidcInvalidateSsoSessionComponent implements OnInit {
  OIDC_CONTINUE_WITH_ID_TOKEN = '';

  constructor(
    private oidcUtils: OidcUtilsService,
    public oidcSecurityService: OidcSecurityService
  ) {}

  async ngOnInit() {
    console.debug('OIDC Invalidating SSO Session Component');
    try {
      const idToken = await lastValueFrom(
        this.oidcSecurityService.getIdToken()
      );
      OIDC_CONTINUE_WITH_ID.set(idToken);
    } catch (e) {
      console.error('Failed to get ID token');
      console.error(e);
    }

    // Invalidate the OIDC sso session immediately, to avoid being signed in to other services.
    // The logout request will make sure we are redirected back to this app where the login flow will
    // continue with verifying the token and logging the user in.
    this.oidcUtils.invalidateSsoSession();
  }
}
