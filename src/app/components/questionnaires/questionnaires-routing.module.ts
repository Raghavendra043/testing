import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherQuestionnairesComponent } from './other-questionnaires/other-questionnaires.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { QuestionnairesComponent } from './questionnaires/questionnaires.component';
import { SendReplyComponent } from './send-reply/send-reply.component';
import { ClinicianService as ClinicianGuard } from '../../services/rest-api-services/clinician.service';

const routes: Routes = [
  {
    path: '',
    component: QuestionnairesComponent,
  },

  {
    path: ':id/questionnaire',
    component: QuestionnaireComponent,
  },
  {
    path: ':id/send_reply',
    component: SendReplyComponent,
  },
  {
    path: 'other_questionnaires',
    component: OtherQuestionnairesComponent,
    canActivate: [ClinicianGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionnairesRoutingModule {}
