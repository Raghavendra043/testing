import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionnaireResultComponent } from './questionnaire-result/questionnaire-result.component';
import { QuestionnaireResultsComponent } from './questionnaire-results/questionnaire-results.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionnaireResultsComponent,
  },
  {
    path: ':id/questionnaire_result',
    component: QuestionnaireResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionnaireResultsRoutingModule {}
