import { Component, Input } from '@angular/core';
import { LoadingState } from '@app/types/loading.type';

@Component({
  selector: 'loading-state',
  templateUrl: './loading-state.component.html',
  styleUrls: ['./loading-state.component.less'],
})
export class LoadingStateComponent {
  @Input() stateModel: LoadingState = 'Loading';
  @Input() hasNoData?: boolean;
  @Input() noDataMessage = '';
  @Input() loadingMessage = '';
  @Input() failedMessage = '';
}
