import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcknowledgementsComponent } from './acknowledgements/acknowledgements.component';

const routes: Routes = [
  {
    path: '',
    component: AcknowledgementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcknowledgementsRoutingModule {}
