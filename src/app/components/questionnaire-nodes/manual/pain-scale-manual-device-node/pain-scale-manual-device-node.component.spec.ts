import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { PainScaleManualDeviceNodeComponent } from './pain-scale-manual-device-node.component';

describe('PainScaleManualDeviceNodeComponent', () => {
  let component: PainScaleManualDeviceNodeComponent;
  let fixture: ComponentFixture<PainScaleManualDeviceNodeComponent>;

  const node = {
    nodeName: '144',
    next: 'ANSEV_143_D142',
    nextFail: 'AN_142_CANCEL',
    text: 'Vælg på nedenstående skala hvor meget smerte du føler',
    painScale: {
      name: '144.PAIN_SCALE',
      type: 'Float',
    },
  };

  async function init(): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [PainScaleManualDeviceNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PainScaleManualDeviceNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = { '144': { PainScaleManualDeviceNode: node } };
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
      'Vælg på nedenstående skala hvor meget smerte du føler'
    );
    expect(representation.leftButton).toBeDefined();
    expect(representation.rightButton).toBeDefined();
  });

  it('should setup right button with click action', async () => {
    const representation: NodeRepresentation = await init();

    const right = representation.rightButton;
    expect(right?.text).toBe('NEXT');
    expect(right?.nextNodeId).toBe('ANSEV_143_D142');
    expect(right?.click).toBeDefined();

    const scope: any = {
      outputModel: {},
      nodeModel: {
        painScaleMeasurement: 6.4,
      },
    };
    component.nodeForm.setValue({
      painScaleMeasurement: 6.4,
    });
    //@ts-ignore
    right?.click(scope);

    const output = scope.outputModel['144.PAIN_SCALE'];
    expect(output.name).toBe('144.PAIN_SCALE');
    expect(output.type).toBe('Float');
    expect(output.value).toBeDefined();
    expect(output.value).toBe(6.4);
  });

  it('should setup left button', async () => {
    const representation: NodeRepresentation = await init();

    const left = representation.leftButton;
    expect(left?.text).toBe('SKIP');
    expect(left?.nextNodeId).toBe('AN_142_CANCEL');
    expect(left?.click).not.toBeDefined();
  });
});
