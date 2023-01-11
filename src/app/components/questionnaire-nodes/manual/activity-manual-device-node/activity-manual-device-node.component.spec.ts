import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { ActivityManualDeviceNodeComponent } from './activity-manual-device-node.component';

describe('ActivityManualDeviceNodeComponent', () => {
  let component: ActivityManualDeviceNodeComponent;
  let fixture: ComponentFixture<ActivityManualDeviceNodeComponent>;

  const node = {
    nodeName: '146',
    text: 'Dit daglige antal skridt',
    next: 'ANSEV_147_D146',
    nextFail: 'AN_146_CANCEL',
    dailySteps: {
      name: '146.ACTIVITY#DAILY_STEPS',
      type: 'Integer',
    },
  };

  async function init(): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [ActivityManualDeviceNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ActivityManualDeviceNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = { '146': { ActivityManualDeviceNode: node } };
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

    expect(component.node.text).toBe('Dit daglige antal skridt');
    expect(representation.leftButton).toBeDefined();
    expect(representation.rightButton).toBeDefined();
  });

  it('should setup right button with validation', async () => {
    const representation: NodeRepresentation = await init();

    const right = representation.rightButton;
    expect(right).toBeDefined();
    expect(right?.text).toBe('NEXT');
    expect(right?.nextNodeId).toBe('ANSEV_147_D146');
    expect(right?.click).toBeDefined();
    expect(right?.validate).toBeDefined();

    const scope: any = {
      outputModel: {
        '146.ACTIVITY#DAILY_STEPS': {},
      },
      nodeModel: {},
    };
    component.nodeForm.setValue({
      dailySteps: '',
    });
    //@ts-ignore
    let isValid = right?.validate(scope);
    expect(isValid).toBe(false);

    component.nodeForm.setValue({
      dailySteps: '9000',
    });
    //@ts-ignore
    isValid = right?.validate(scope);
    expect(isValid).toBe(true);
  });

  it('should setup right button with click action', async () => {
    const representation: NodeRepresentation = await init();

    const right = representation.rightButton;
    expect(right?.text).toBe('NEXT');
    expect(right?.nextNodeId).toBe('ANSEV_147_D146');
    expect(right?.click).toBeDefined();

    const scope = {
      outputModel: {
        '146.ACTIVITY#DAILY_STEPS': {},
      },
    };
    component.nodeForm.setValue({
      dailySteps: '10234',
    });
    //@ts-ignore
    right?.click(scope);

    const output: any = scope.outputModel['146.ACTIVITY#DAILY_STEPS'];
    expect(output.name).toBe('146.ACTIVITY#DAILY_STEPS');
    expect(output.type).toBe('Integer');
    expect(output.value).toBe(10234);
  });

  it('should setup left button', async () => {
    const representation: NodeRepresentation = await init();

    const left = representation.leftButton;
    expect(left?.text).toBe('SKIP');
    expect(left?.nextNodeId).toBe('AN_146_CANCEL');
    expect(left?.click).not.toBeDefined();
  });
});
