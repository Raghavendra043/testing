import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { HeaderModule } from '../header/header.module';
import { ThreadComponent } from './thread/thread.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClickableLinksPipe } from 'src/app/pipes/clickable-links.pipe';
import { LoadingModule } from '../loading/loading.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ThreadImageComponent } from './thread-image/thread-image.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';

@NgModule({
  declarations: [
    MessagesComponent,
    ThreadComponent,
    ClickableLinksPipe,
    ThreadImageComponent,
    ImagePickerComponent,
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    HeaderModule,
    SharedModule,
    FormsModule,
    LoadingModule,
    NotificationsModule,
  ],
})
export class MessagesModule {}
