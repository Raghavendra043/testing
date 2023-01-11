import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { SaturationWithoutPulseManualDeviceNodeComponent } from './saturation-without-pulse-manual-device-node.component';

describe('SaturationWithoutPulseManualDeviceNodeComponent', () => {
  let component: SaturationWithoutPulseManualDeviceNodeComponent;
  let fixture: ComponentFixture<SaturationWithoutPulseManualDeviceNodeComponent>;

  const node: any = {
    nodeName: '319',
    next: 'ANSEV_320_D319',
    nextFail: 'AN_319_CANCEL',
    text: 'Saturation',
    helpText: null,
    helpImage: null,
    saturation: {
      name: '319.SAT#SATURATION',
      type: 'Integer',
    },
    origin: {
      name: '319.SAT#ORIGIN',
      type: 'Object',
    },
  };

  async function init(): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [SaturationWithoutPulseManualDeviceNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(
      SaturationWithoutPulseManualDeviceNodeComponent
    );

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = { '319': { SaturationWithoutPulseDeviceNode: node } };
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
    expect(right?.nextNodeId).toBe('ANSEV_320_D319');
    expect(right?.validate).toBeDefined();
    expect(right?.click).toBeDefined();

    const originJson = {
      manualMeasurement: {
        enteredBy: 'citizen',
      },
    };

    const scope: any = {
      outputModel: {},
      nodeModel: {
        saturation: 98,
        origin: originJson,
      },
    };

    component.nodeForm.setValue({
      saturation: '98',
    });

    //@ts-ignore
    right.click(scope);

    const saturation = scope.outputModel['319.SAT#SATURATION'];
    expect(saturation.name).toBe('319.SAT#SATURATION');
    expect(saturation.type).toBe('Integer');
    expect(saturation.value).toBe('98');

    const origin = scope.outputModel['319.SAT#ORIGIN'];
    expect(origin.name).toBe('319.SAT#ORIGIN');
    expect(origin.type).toBe('Object');
    expect(origin.value).toEqual(originJson);
  });
});
