import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/rest-api-services/authentication.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.less'],
})
export class LogoutComponent implements OnInit {
  constructor(
    private appContext: StatePassingService,
    private authentication: AuthenticationService,
    private router: Router
  ) {}

  async ngOnInit() {
    const currentUser = this.appContext.currentUser.get();
    if (currentUser !== undefined) {
      await lastValueFrom(this.authentication.logout(currentUser));
      await this.router.navigate(['login']);
    }
  }
}
