import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less'],
})
export class NotificationsComponent {
  @Input() info: string | undefined = undefined;
  @Input() error: string | undefined = undefined;

  constructor() {}
}
