import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { SaturationManualDeviceNodeComponent } from './saturation-manual-device-node.component';

describe('SaturationManualDeviceNodeComponent', () => {
  let component: SaturationManualDeviceNodeComponent;
  let fixture: ComponentFixture<SaturationManualDeviceNodeComponent>;

  const node: any = {
    saturation: {
      name: '313.SAT#SATURATION',
      type: 'Integer',
    },
    pulse: {
      name: '313.SAT#PULSE',
      type: 'Integer',
    },
    origin: {
      name: '313.SAT#ORIGIN',
      type: 'Object',
    },
    nodeName: '313',
    next: 'ANSEV_314_D313',
    nextFail: 'AN_313_CANCEL',
    text: 'Saturation',
    helpText: null,
    helpImage: null,
  };

  async function init(): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [SaturationManualDeviceNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SaturationManualDeviceNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = { '313': { SaturationDeviceNode: node } };
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
    expect(representation.nodeModel.heading).toBe('Saturation');
    expect(representation.leftButton).toBeDefined();
    expect(representation.rightButton).toBeDefined();
  });

  it('should setup right button with click action', async () => {
    const representation: NodeRepresentation = await init();

    const right = representation.rightButton;
    expect(right?.text).toBe('NEXT');
    expect(right?.nextNodeId).toBe('ANSEV_314_D313');
    expect(right?.validate).toBeDefined();
    expect(right?.click).toBeDefined();

    const scope: any = {
      outputModel: {},
      nodeModel: {},
    };
    //@ts-ignore
    expect(right?.validate(scope)).toBe(false);

    const originJson = {
      manualMeasurement: {
        enteredBy: 'citizen',
      },
    };

    scope.nodeModel = {
      saturation: 98,
      pulse: 80,
      origin: originJson,
    };
    component.nodeForm.setValue({
      saturation: '98',
      pulse: '80',
    });

    //@ts-ignore
    expect(right.validate(scope)).toBe(true);
    //@ts-ignore
    right.click(scope);

    const saturation = scope.outputModel['313.SAT#SATURATION'];
    expect(saturation.name).toBe('313.SAT#SATURATION');
    expect(saturation.type).toBe('Integer');
    expect(saturation.value).toBeDefined(98);

    const pulse = scope.outputModel['313.SAT#PULSE'];
    expect(pulse.name).toBe('313.SAT#PULSE');
    expect(pulse.type).toBe('Integer');
    expect(pulse.value).toBeDefined(80);

    const origin = scope.outputModel['313.SAT#ORIGIN'];
    expect(origin.name).toBe('313.SAT#ORIGIN');
    expect(origin.type).toBe('Object');
    expect(origin.value).toEqual(originJson);
  });

  it('should setup left button', async () => {
    const representation: NodeRepresentation = await init();

    const left = representation.leftButton;
    expect(left?.text).toBe('SKIP');
    expect(left?.nextNodeId).toBe('AN_313_CANCEL');
  });
});
