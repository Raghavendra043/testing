import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcknowledgementsComponent } from './acknowledgements/acknowledgements.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../header/header.module';
import { AcknowledgementsRoutingModule } from './acknowledgements-routing.module';
import { LoadingModule } from '../loading/loading.module';

@NgModule({
  declarations: [AcknowledgementsComponent],
  imports: [
    CommonModule,
    AcknowledgementsRoutingModule,
    HeaderModule,
    SharedModule,
    LoadingModule,
  ],
})
export class AcknowledgementsModule {}
