import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PinCodeLoginComponent } from './pin-code-login/pin-code-login.component';

const routes: Routes = [
  {
    path: '',
    component: PinCodeLoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PinCodeLoginRoutingModule {}
