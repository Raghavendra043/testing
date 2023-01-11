import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyMeasurementComponent } from './my-measurement/my-measurement.component';
import { MyMeasurementsComponent } from './my-measurements/my-measurements.component';

const routes: Routes = [
  {
    path: '',
    component: MyMeasurementsComponent,
  },
  {
    path: ':id/measurement',
    component: MyMeasurementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyMeasurementsRoutingModule {}
