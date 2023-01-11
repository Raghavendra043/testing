import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';
import { BloodSugarMGDLManualDeviceNodeComponent } from './blood-sugar-mgdl-manual-device-node.component';

describe('BloodSugarMGDLManualDeviceNodeComponent', () => {
  let component: BloodSugarMGDLManualDeviceNodeComponent;
  let fixture: ComponentFixture<BloodSugarMGDLManualDeviceNodeComponent>;

  const node = {
    nodeName: '158',
    next: 'ANSEV_159_D158',
    nextFail: 'AN_158_CANCEL',
    text: 'Blodsukker',
    comment: {
      name: '158.BSMGDL#COMMENT',
      type: 'String',
    },
    bloodSugarMeasurements: {
      name: '158.BSMGDL#BLOODSUGARMEASUREMENTS',
      type: 'Object',
    },
    origin: {
      name: '158.BSMGDL#ORIGIN',
      type: 'Object',
    },
  };

  async function init(): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [BloodSugarMGDLManualDeviceNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BloodSugarMGDLManualDeviceNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = { '158': { BloodSugarMGDLManualDeviceNode: node } };
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
    expect(representation.nodeModel.heading).toBe('Blodsukker');
    //@ts-ignore
    expect(representation.nodeModel.comment.name).toBe('158.BSMGDL#COMMENT');
    expect(representation.leftButton).toBeDefined();
    expect(representation.rightButton).toBeDefined();
  });

  it('should setup right button with click action', async () => {
    const representation: NodeRepresentation = await init();

    const right = representation.rightButton;
    expect(right?.text).toBe('NEXT');
    expect(right?.nextNodeId).toBe('ANSEV_159_D158');
    expect(right?.click).toBeDefined();

    const scope: any = {
      outputModel: {},
      nodeModel: {
        comment: {
          text: undefined,
        },
      },
    };
    //@ts-ignore
    right.click(scope);

    const output = scope.outputModel['158.BSMGDL#BLOODSUGARMEASUREMENTS'];
    expect(output.name).toBe('158.BSMGDL#BLOODSUGARMEASUREMENTS');
    expect(output.type).toBe('Object');
    expect(output.value).toBeDefined();
    expect(output.value.measurements.length).toBe(1);

    const measurements = output.value.measurements[0];
    expect(measurements.hasOwnProperty('result')).toBe(true);
    expect(measurements.hasOwnProperty('isBeforeMeal')).toBe(true);
    expect(measurements.hasOwnProperty('isAfterMeal')).toBe(true);
    expect(measurements.hasOwnProperty('timeOfMeasurement')).toBe(true);

    const comment = scope.outputModel['158.BSMGDL#COMMENT'];
    expect(comment.name).toBe('158.BSMGDL#COMMENT');
    expect(comment.type).toBe('String');
    expect(comment.value).toBe(undefined);
  });

  it('should setup left button', async () => {
    const representation: NodeRepresentation = await init();

    const left = representation?.leftButton;
    expect(left?.text).toBe('SKIP');
    expect(left?.nextNodeId).toBe('AN_158_CANCEL');
    expect(left?.click).not.toBeDefined();
  });
});
