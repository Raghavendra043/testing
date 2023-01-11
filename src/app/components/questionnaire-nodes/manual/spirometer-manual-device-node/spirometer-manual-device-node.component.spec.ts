import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';
import { SpirometerManualDeviceNodeComponent } from './spirometer-manual-device-node.component';

describe('SpirometerManualDeviceNodeComponent', () => {
  let component: SpirometerManualDeviceNodeComponent;
  let fixture: ComponentFixture<SpirometerManualDeviceNodeComponent>;

  const node = {
    nodeName: '172',
    next: 'ANSEV_173_D172',
    nextFail: 'AN_172_CANCEL',
    text: 'Måling af lungefunktion',
    fev1: {
      name: '172.LF#FEV1',
      type: 'Float',
    },
    fev6: {
      name: '172.LF#FEV6',
      type: 'Float',
    },
    fev1Fev6Ratio: {
      name: '172.LF#FEV1_FEV6_RATIO',
      type: 'Float',
    },
    fef2575: {
      name: '172.LF#FEF2575',
      type: 'Float',
    },
    origin: {
      name: '172.LF#ORIGIN',
      type: 'Object',
    },
  };

  async function init(): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [SpirometerManualDeviceNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SpirometerManualDeviceNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = { '146': { spirometerManualDeviceNode: node } };
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
    expect(representation.nodeModel.heading).toBe('Måling af lungefunktion');
    expect(representation.leftButton).toBeDefined();
    expect(representation.rightButton).toBeDefined();
  });

  it('should setup right button with click action', async () => {
    const representation: NodeRepresentation = await init();

    const right = representation.rightButton;
    expect(right?.text).toBe('NEXT');
    expect(right?.nextNodeId).toBe('ANSEV_173_D172');
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
      fev1: 2.71,
      fev6: 3.2,
      fev1Fev6Ratio: 0.85,
      fef2575: 2.37,
      origin: originJson,
    };
    component.nodeForm.setValue({
      fev1: '2.71',
      fev6: '3.2',
      fev1Fev6Ratio: '0.85',
      fef2575: '2.37',
    });
    //@ts-ignore
    expect(right.validate(scope)).toBe(true);
    //@ts-ignore
    right.click(scope);

    const fev1 = scope.outputModel['172.LF#FEV1'];
    expect(fev1.name).toBe('172.LF#FEV1');
    expect(fev1.type).toBe('Float');
    expect(fev1.value).toBe('2.71');

    const fev6 = scope.outputModel['172.LF#FEV6'];
    expect(fev6.name).toBe('172.LF#FEV6');
    expect(fev6.type).toBe('Float');
    expect(fev6.value).toBe('3.2');

    const fev1Fev6Ratio = scope.outputModel['172.LF#FEV1_FEV6_RATIO'];
    expect(fev1Fev6Ratio.name).toBe('172.LF#FEV1_FEV6_RATIO');
    expect(fev1Fev6Ratio.type).toBe('Float');
    expect(fev1Fev6Ratio.value).toBe('0.85');

    const fef2575 = scope.outputModel['172.LF#FEF2575'];
    expect(fef2575.name).toBe('172.LF#FEF2575');
    expect(fef2575.type).toBe('Float');
    expect(fef2575.value).toBe('2.37');

    const origin = scope.outputModel['172.LF#ORIGIN'];
    expect(origin.name).toBe('172.LF#ORIGIN');
    expect(origin.type).toBe('Object');
    expect(origin.value).toEqual(originJson);
  });

  it('should setup left button', async () => {
    const representation: NodeRepresentation = await init();

    const left = representation.leftButton;
    expect(left?.text).toBe('SKIP');
    expect(left?.nextNodeId).toBe('AN_172_CANCEL');
  });
});
