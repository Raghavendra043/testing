import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetPinCodeComponent } from './set-pin-code/set-pin-code.component';

const routes: Routes = [
  {
    path: '',
    component: SetPinCodeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetPinCodeRoutingModule {}
