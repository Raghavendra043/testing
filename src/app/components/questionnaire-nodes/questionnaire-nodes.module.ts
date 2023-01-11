import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BloodSugarManualDeviceNodeComponent } from './manual/blood-sugar-manual-device-node/blood-sugar-manual-device-node.component';
import { AssignmentNodeComponent } from './other/assignment-node/assignment-node.component';
import { EndNodeComponent } from './other/end-node/end-node.component';
import { IONodeComponent } from './manual/ionode/ionode.component';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { FocusOnLoadDirective } from 'src/app/directives/focus-on-load.directive';
import { BloodPressureManualDeviceNodeComponent } from './manual/blood-pressure-manual-device-node/blood-pressure-manual-device-node.component';
import { ActivityManualDeviceNodeComponent } from './manual/activity-manual-device-node/activity-manual-device-node.component';
import { BloodSugarMGDLManualDeviceNodeComponent } from './manual/blood-sugar-mgdl-manual-device-node/blood-sugar-mgdl-manual-device-node.component';
import { PainScaleManualDeviceNodeComponent } from './manual/pain-scale-manual-device-node/pain-scale-manual-device-node.component';
import { CrpManualDeviceNodeComponent } from './manual/crp-manual-device-node/crp-manual-device-node.component';
import { SaturationManualDeviceNodeComponent } from './manual/saturation-manual-device-node/saturation-manual-device-node.component';
import { SaturationWithoutPulseManualDeviceNodeComponent } from './manual/saturation-without-pulse-manual-device-node/saturation-without-pulse-manual-device-node.component';
import { SpirometerManualDeviceNodeComponent } from './manual/spirometer-manual-device-node/spirometer-manual-device-node.component';
import { EnumDeviceNodeComponent } from './manual/enum-device-node/enum-device-node.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../header/header.module';
import { MultipleChoiceNodeComponent } from './multiple-choice/multiple-choice-node/multiple-choice-node.component';
import { MultipleChoiceQuestionNodeComponent } from './multiple-choice/multiple-choice-question-node/multiple-choice-question-node.component';
import { MultipleChoiceSummationNodeComponent } from './multiple-choice/multiple-choice-summation-node/multiple-choice-summation-node.component';
import { DelayNodeComponent } from './other/delay-node/delay-node.component';
import { TimerComponent } from './other/timer/timer.component';
import { AutomaticDeviceNodeComponent } from './automatic/automatic-device-node/automatic-device-node.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { ManualDeviceNodeComponent } from '@components/questionnaire-nodes/manual/manual-device-node/manual-device-node.component';
import { UnsupportedNodeComponent } from './other/unsupported-node/unsupported-node.component';
import { EcgDeviceNodeComponent } from './automatic/ecg-device-node/ecg-device-node.component';

@NgModule({
  declarations: [
    BloodSugarManualDeviceNodeComponent,
    AssignmentNodeComponent,
    EndNodeComponent,
    IONodeComponent,
    SafePipe,
    FocusOnLoadDirective,
    BloodPressureManualDeviceNodeComponent,
    ActivityManualDeviceNodeComponent,
    BloodSugarMGDLManualDeviceNodeComponent,
    ManualDeviceNodeComponent,
    PainScaleManualDeviceNodeComponent,
    CrpManualDeviceNodeComponent,
    SaturationManualDeviceNodeComponent,
    SaturationWithoutPulseManualDeviceNodeComponent,
    SpirometerManualDeviceNodeComponent,
    EnumDeviceNodeComponent,
    MultipleChoiceNodeComponent,
    MultipleChoiceQuestionNodeComponent,
    MultipleChoiceSummationNodeComponent,
    DelayNodeComponent,
    TimerComponent,
    AutomaticDeviceNodeComponent,
    UnsupportedNodeComponent,
    EcgDeviceNodeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    HeaderModule,
    NotificationsModule,
  ],
  exports: [
    BloodSugarManualDeviceNodeComponent,
    AssignmentNodeComponent,
    EndNodeComponent,
  ],
})
export class QuestionnaireNodesModule {}
