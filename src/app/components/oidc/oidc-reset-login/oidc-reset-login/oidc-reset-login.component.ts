import { Component, OnInit } from '@angular/core';
import { OidcUtilsService } from 'src/app/services/oidc-services/oidc-utils.service';

@Component({
  selector: 'app-oidc-reset-login',
  templateUrl: './oidc-reset-login.component.html',
  styleUrls: ['./oidc-reset-login.component.less'],
})
export class OidcResetLoginComponent {
  constructor(private oidcUtils: OidcUtilsService) {
    this.oidcUtils.sendLogoutRequest();
  }
}
