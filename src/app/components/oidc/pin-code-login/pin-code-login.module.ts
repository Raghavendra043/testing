import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PinCodeLoginRoutingModule } from './pin-code-login-routing.module';
import { PinCodeLoginComponent } from './pin-code-login/pin-code-login.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../../header/header.module';

@NgModule({
  declarations: [PinCodeLoginComponent],
  imports: [
    CommonModule,
    PinCodeLoginRoutingModule,
    FormsModule,
    SharedModule,
    HeaderModule,
  ],
})
export class PinCodeLoginModule {}
