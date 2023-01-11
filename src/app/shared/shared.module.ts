import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SeverityPipe } from '@pipes/severity.pipe';
import {
  ConstraintColorPipe,
  ConstraintTextPipe,
} from '@pipes/constraint.pipe';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [SeverityPipe, ConstraintColorPipe, ConstraintTextPipe],
  exports: [
    SeverityPipe,
    ConstraintColorPipe,
    ConstraintTextPipe,
    TranslateModule,
    MomentModule,
  ],
})
export class SharedModule {}
