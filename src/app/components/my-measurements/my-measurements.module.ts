import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyMeasurementsRoutingModule } from './my-measurements-routing.module';
import { MyMeasurementsComponent } from './my-measurements/my-measurements.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../header/header.module';
import { LoadingModule } from '../loading/loading.module';
import { MyMeasurementComponent } from './my-measurement/my-measurement.component';
import { NgChartsModule } from 'ng2-charts';
import 'chartjs-adapter-date-fns';

@NgModule({
  declarations: [MyMeasurementsComponent, MyMeasurementComponent],
  imports: [
    CommonModule,
    MyMeasurementsRoutingModule,
    SharedModule,
    HeaderModule,
    LoadingModule,
    NgChartsModule,
  ],
})
export class MyMeasurementsModule {}
