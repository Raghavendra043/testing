import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-widget',
  templateUrl: './loading-widget.component.html',
  styleUrls: ['./loading-widget.component.less'],
})
export class LoadingWidgetComponent {
  @Input() showSpinner = false;
  constructor() {}
}
