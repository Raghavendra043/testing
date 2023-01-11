import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinConferenceComponent } from './join-conference/join-conference.component';

const routes: Routes = [
  {
    path: '',
    component: JoinConferenceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConferenceRoutingModule {}
