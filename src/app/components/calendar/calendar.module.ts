import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { HeaderModule } from '../header/header.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoadingModule } from '../loading/loading.module';

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    HeaderModule,
    SharedModule,
    LoadingModule,
  ],
})
export class CalendarModule {}
