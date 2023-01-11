import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatePatientRoutingModule } from './create-patient-routing.module';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { HeaderModule } from '@components/header/header.module';
import { SharedModule } from '@app/shared/shared.module';
import { LoadingModule } from '@components/loading/loading.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [CreatePatientComponent],
  imports: [
    CommonModule,
    CreatePatientRoutingModule,
    HeaderModule,
    SharedModule,
    LoadingModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
  ],
})
export class CreatePatientModule {}
