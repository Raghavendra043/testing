import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClinicianMenuComponent } from './clinician-menu/clinician-menu.component';

const routes: Routes = [
  {
    path: '',
    component: ClinicianMenuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicianMenuRoutingModule {}
