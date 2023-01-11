import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications/notifications.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NotificationsComponent],
  imports: [CommonModule, SharedModule],
  exports: [NotificationsComponent],
})
export class NotificationsModule {}
