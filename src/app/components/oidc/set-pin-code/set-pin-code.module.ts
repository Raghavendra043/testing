import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetPinCodeRoutingModule } from './set-pin-code-routing.module';
import { SetPinCodeComponent } from './set-pin-code/set-pin-code.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../../header/header.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SetPinCodeComponent],
  imports: [
    CommonModule,
    SetPinCodeRoutingModule,
    FormsModule,
    SharedModule,
    HeaderModule,
  ],
})
export class SetPinCodeModule {}
