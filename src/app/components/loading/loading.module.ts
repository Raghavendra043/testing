import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingStateComponent } from './loading-state/loading-state.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoadingWidgetComponent } from './loading-widget/loading-widget.component';

@NgModule({
  declarations: [LoadingStateComponent, LoadingWidgetComponent],
  imports: [CommonModule, SharedModule],
  exports: [LoadingStateComponent, LoadingWidgetComponent],
})
export class LoadingModule {}
