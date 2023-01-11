import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConferenceRoutingModule } from './conference-routing.module';
import { JoinConferenceComponent } from './join-conference/join-conference.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [JoinConferenceComponent],
  imports: [CommonModule, ConferenceRoutingModule, SharedModule, HeaderModule],
})
export class ConferenceModule {}
