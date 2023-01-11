import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorsRoutingModule } from './errors-routing.module';
import { ErrorsComponent } from './errors/errors.component';
import { HeaderModule } from '../header/header.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ErrorsComponent],
  imports: [CommonModule, ErrorsRoutingModule, HeaderModule, SharedModule],
})
export class ErrorsModule {}
