import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionnaireResultsRoutingModule } from './questionnaire-results-routing.module';
import { QuestionnaireResultsComponent } from './questionnaire-results/questionnaire-results.component';
import { QuestionnaireResultComponent } from './questionnaire-result/questionnaire-result.component';
import { HeaderModule } from '../header/header.module';
import { SharedModule } from '@app/shared/shared.module';
import { PrettyReplyDirective } from 'src/app/directives/pretty-reply.directive';
import { LoadingModule } from '../loading/loading.module';

@NgModule({
  declarations: [
    PrettyReplyDirective,
    QuestionnaireResultsComponent,
    QuestionnaireResultComponent,
  ],
  imports: [
    QuestionnaireResultsRoutingModule,
    CommonModule,
    HeaderModule,
    SharedModule,
    LoadingModule,
  ],
})
export class QuestionnaireResultsModule {}
