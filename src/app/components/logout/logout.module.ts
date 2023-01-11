import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutRoutingModule } from './logout-routing.module';
import { LogoutComponent } from './logout/logout.component';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [LogoutComponent],
  imports: [CommonModule, LogoutRoutingModule, HeaderModule],
})
export class LogoutModule {}
