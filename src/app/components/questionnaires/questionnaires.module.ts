import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionnairesRoutingModule } from './questionnaires-routing.module';
import { QuestionnairesComponent } from './questionnaires/questionnaires.component';
import { HeaderModule } from '../header/header.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from '../loading/loading.module';
import { SendReplyComponent } from './send-reply/send-reply.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { QuestionnaireNodesModule } from '../questionnaire-nodes/questionnaire-nodes.module';
import { NodeDirective } from 'src/app/directives/node.directive';
import { OtherQuestionnairesComponent } from './other-questionnaires/other-questionnaires.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    QuestionnairesComponent,
    QuestionnaireComponent,
    SendReplyComponent,
    NodeDirective,
    OtherQuestionnairesComponent,
  ],
  imports: [
    CommonModule,
    QuestionnairesRoutingModule,
    HeaderModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModule,
    NotificationsModule,
    QuestionnaireNodesModule,
    NgMultiSelectDropDownModule,
  ],
})
export class QuestionnairesModule {}
