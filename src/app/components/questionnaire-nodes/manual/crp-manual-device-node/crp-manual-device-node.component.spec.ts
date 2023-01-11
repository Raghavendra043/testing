import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { CrpManualDeviceNodeComponent } from './crp-manual-device-node.component';

describe('CrpManualDeviceNodeComponent', () => {
  let component: CrpManualDeviceNodeComponent;
  let fixture: ComponentFixture<CrpManualDeviceNodeComponent>;
  const node = {
    nodeName: '146',
    text: 'Indtast værdi eller vælg <5',
    next: 'ANSEV_147_D146',
    nextFail: 'AN_146_CANCEL',
    CRP: {
      name: '146.CRP',
      type: 'Integer',
    },
  };

  async function init(): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [CrpManualDeviceNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CrpManualDeviceNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = { '146': { CRPManualDeviceNode: node } };
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
    expect(representation.nodeModel.heading).toBe(
      'Indtast værdi eller vælg <5'
    );
    expect(representation.leftButton).toBeDefined();
    expect(representation.rightButton).toBeDefined();
  });

  it('should setup right button with validation', async () => {
    const representation: NodeRepresentation = await init();

    const right = representation.rightButton;
    expect(right?.text).toBe('NEXT');
    expect(right?.nextNodeId).toBe('ANSEV_147_D146');
    expect(right?.click).toBeDefined();
    expect(right?.validate).toBeDefined();

    const scope: any = {
      outputModel: {
        '146.CRP': {},
      },
      nodeModel: {},
    };
    component.nodeForm.setValue({
      crpLt5Measurement: false,
      crpCountMeasurement: '',
    });

    //@ts-ignore
    let isValid = right.validate(scope);
    expect(isValid).toBe(false);
    component.nodeForm.setValue({
      crpLt5Measurement: false,
      crpCountMeasurement: '6',
    });
    //@ts-ignore
    isValid = right.validate(scope);
    expect(isValid).toBe(true);
  });

  it('should setup right button with click action (lt5)', async () => {
    const representation: NodeRepresentation = await init();

    const right = representation.rightButton;
    expect(right?.text).toBe('NEXT');
    expect(right?.nextNodeId).toBe('ANSEV_147_D146');
    expect(right?.click).toBeDefined();

    const scope = {
      outputModel: {
        '146.CRP': {},
      },
      nodeModel: {
        crpLt5Measurement: true,
      },
    };
    component.nodeForm.setValue({
      crpLt5Measurement: true,
      crpCountMeasurement: '',
    });

    //@ts-ignore
    right.click(scope);

    const output: any = scope.outputModel['146.CRP'];
    expect(output.name).toBe('146.CRP');
    expect(output.type).toBe('Integer');
    expect(output.value).toBe(0);
  });

  it('should setup right button with click action (count)', async () => {
    const representation: NodeRepresentation = await init();

    const right = representation.rightButton;
    expect(right?.text).toBe('NEXT');
    expect(right?.nextNodeId).toBe('ANSEV_147_D146');
    expect(right?.click).toBeDefined();

    const scope = {
      outputModel: {
        '146.CRP': {},
      },
      nodeModel: {
        crpCountMeasurement: 7,
      },
    };
    component.nodeForm.setValue({
      crpLt5Measurement: false,
      crpCountMeasurement: '7',
    });

    //@ts-ignore
    right.click(scope);

    const output: any = scope.outputModel['146.CRP'];
    expect(output.name).toBe('146.CRP');
    expect(output.type).toBe('Integer');
    expect(output.value).toBe(7);
  });

  it('should setup right button with click action (count < 5)', async () => {
    const representation: NodeRepresentation = await init();

    const right = representation.rightButton;
    expect(right?.text).toBe('NEXT');
    expect(right?.nextNodeId).toBe('ANSEV_147_D146');
    expect(right?.click).toBeDefined();

    const scope: any = {
      outputModel: {
        '146.CRP': {},
      },
      nodeModel: {
        crpCountMeasurement: 3,
      },
    };
    component.nodeForm.setValue({
      crpLt5Measurement: false,
      crpCountMeasurement: '3',
    });
    //@ts-ignore
    right.click(scope);

    const output = scope.outputModel['146.CRP'];
    expect(output.name).toBe('146.CRP');
    expect(output.type).toBe('Integer');
    expect(output.value).toBe(0);
  });

  it('should setup left button', async () => {
    const representation: NodeRepresentation = await init();

    const left = representation.leftButton;
    expect(left?.text).toBe('SKIP');
    expect(left?.nextNodeId).toBe('AN_146_CANCEL');
    expect(left?.click).not.toBeDefined();
  });
});
