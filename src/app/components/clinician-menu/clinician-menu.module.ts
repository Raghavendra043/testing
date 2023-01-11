import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicianMenuRoutingModule } from './clinician-menu-routing.module';
import { ClinicianMenuComponent } from './clinician-menu/clinician-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '@components/header/header.module';
import { SharedModule } from '@app/shared/shared.module';
import { LoadingModule } from '@components/loading/loading.module';

@NgModule({
  declarations: [ClinicianMenuComponent],
  imports: [
    CommonModule,
    ClinicianMenuRoutingModule,
    HeaderModule,
    SharedModule,
    LoadingModule,
    ReactiveFormsModule,
  ],
})
export class ClinicianMenuModule {}
