import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/rest-api-services/authentication.service';

@Component({
  selector: 'app-oidc-logout',
  templateUrl: './oidc-logout.component.html',
  styleUrls: ['./oidc-logout.component.less'],
})
export class OidcLogoutComponent {
  constructor(
    private authentication: AuthenticationService,
    private router: Router
  ) {
    this.authentication.clearCurrentAuthToken();
    this.router.navigate(['/login']);
  }
}
