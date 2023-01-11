import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { QuestionnaireNodesModule } from '@components/questionnaire-nodes/questionnaire-nodes.module';
import { TranslateModule } from '@ngx-translate/core';

import { DelayNodeComponent } from './delay-node.component';

describe('DelayNodeComponent', () => {
  let component: DelayNodeComponent;
  let fixture: ComponentFixture<DelayNodeComponent>;

  const node = {
    nodeName: '176',
    elements: [],
    countTime: 3,
    countUp: false,
    displayTextString: 'Nedtælling på 45 sek inden teststart',
    next: '177',
  };

  async function init(): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [DelayNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
        QuestionnaireNodesModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DelayNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = { '177': { DelayNode: node } };
    //@ts-ignore
    component.scope = { hasOffendingValue: () => false };
    //@ts-ignore
    component.parameters = undefined;
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    //@ts-ignore
    const representation: NodeRepresentation = component.getRepresentation();
    return representation;
  }

  it('should parse node', async () => {
    const representation: NodeRepresentation = await init();

    expect(representation).toBeDefined();
    expect(representation.nodeModel.nodeId).toBe('176');
    expect(representation.nodeModel.heading).toBe(
      'Nedtælling på 45 sek inden teststart'
    );
    expect(representation.nodeModel.count).toBe(3);
    //@ts-ignore
    expect(representation.nodeModel?.countTime).toBe(3);
    //@ts-ignore
    expect(representation.nodeModel?.countUp).toBe(false);
    //@ts-ignore
    expect(representation.nodeModel?.onTimerStopped).toBeDefined();
    expect(representation.leftButton).toBeUndefined();
    expect(representation.rightButton).toBeUndefined();
  });
});
