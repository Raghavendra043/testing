import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HeaderModule } from '../header/header.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    FormsModule,
    HeaderModule,
    SharedModule,
  ],
})
export class ChangePasswordModule {}
