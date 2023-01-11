import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { ThreadComponent } from './thread/thread.component';

const routes: Routes = [
  {
    path: '',
    component: MessagesComponent,
  },
  {
    path: ':id/thread',
    component: ThreadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagesRoutingModule {}
