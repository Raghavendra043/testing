import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { ManualDeviceNodeComponent } from './manual-device-node.component';

describe('ManualDeviceNodeComponent: ', () => {
  let component: ManualDeviceNodeComponent;
  let fixture: ComponentFixture<ManualDeviceNodeComponent>;

  async function init(
    node: any,
    nodeMap: any,
    parserTypeName: string
  ): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [ManualDeviceNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ManualDeviceNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = nodeMap; 

    //@ts-ignore
    component.scope = { hasOffendingValue: () => false };
    component.parameters = { parserTypeName: parserTypeName };
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    //@ts-ignore
    const representation: NodeRepresentation = component.getRepresentation();
    return representation;
  }

  describe('HeightManualDeviceNode', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_143_D142',
      nextFail: 'AN_142_CANCEL',
      text: 'Mål din højde og indtast resultatet i feltet nedenfor',
      height: {
        name: '144.HEIGHT',
        type: 'Float',
      },
      origin: {
        name: '144.HEIGHT#ORIGIN',
        type: 'Object',
      },
    };
    const nodeMap = { '144': { HeightManualDeviceNode: node } };
    const parserTypeName = 'height';

    it('should parse node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toBe(
        'Mål din højde og indtast resultatet i feltet nedenfor'
      );
      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should setup right button with click action', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe('ANSEV_143_D142');
      expect(right?.click).toBeDefined();

      const originJson = {
        manualMeasurement: {
          enteredBy: 'citizen',
        },
      };

      const scope: any = {
        outputModel: {},
        nodeModel: {
          height: 178,
          origin: originJson,
        },
      };

      component.nodeForm.setValue({
        inputControls: [178],
      });
      //@ts-ignore
      right.click(scope);

      const output = scope.outputModel['144.HEIGHT'];
      expect(output.name).toBe('144.HEIGHT');
      expect(output.type).toBe('Float');
      expect(output.value).toBeDefined();
      expect(output.value).toBe(178);

      const origin = scope.outputModel['144.HEIGHT#ORIGIN'];
      expect(origin.name).toBe('144.HEIGHT#ORIGIN');
      expect(origin.type).toBe('Object');
      expect(origin.value).toEqual(originJson);
    });

    it('should setup left button', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe('AN_142_CANCEL');
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('HemoglobinManualDeviceNode', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_143_D142',
      nextFail: 'AN_142_CANCEL',
      text: 'Enter your hemoglobin value',
      hemoglobin: {
        name: '144.HEMOGLOBIN',
        type: 'Float',
      },
      origin: {
        name: '144.HEMOGLOBIN#ORIGIN',
        type: 'Object',
      },
    };

    const nodeMap = { '144': { HemoglobinManualDeviceNode: node } };
    const parserTypeName = 'hemoglobin';

    it('should parse node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toBe(
        'Enter your hemoglobin value'
      );
      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should setup right button with click action', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe('ANSEV_143_D142');
      expect(right?.click).toBeDefined();

      const originJson = {
        manualMeasurement: {
          enteredBy: 'citizen',
        },
      };

      const scope: any = {
        outputModel: {},
        nodeModel: {
          hemoglobin: 5.4,
          origin: originJson,
        },
      };

      component.nodeForm.setValue({
        inputControls: [5.4],
      });
      //@ts-ignore
      right.click(scope);

      const output = scope.outputModel['144.HEMOGLOBIN'];
      expect(output.name).toBe('144.HEMOGLOBIN');
      expect(output.type).toBe('Float');
      expect(output.value).toBeDefined();
      expect(output.value).toBe(5.4);

      const origin = scope.outputModel['144.HEMOGLOBIN#ORIGIN'];
      expect(origin.name).toBe('144.HEMOGLOBIN#ORIGIN');
      expect(origin.type).toBe('Object');
      expect(origin.value).toEqual(originJson);
    });

    it('should setup left button', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe('AN_142_CANCEL');
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('OxygenFlowManualDeviceNode', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_143_D142',
      nextFail: 'AN_142_CANCEL',
      text: 'Measure your oxygen flow',
      oxygenFlow: {
        name: '144.OXYGEN_FLOW',
        type: 'Float',
      },
      origin: {
        name: '144.OXYGEN_FLOW#ORIGIN',
        type: 'Object',
      },
    };
    const nodeMap = { '144': { PulseManualDeviceNode: node } };
    const parserTypeName = 'oxygenFlow';

    it('should parse node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toBe('Measure your oxygen flow');
      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should setup right button with click action', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe('ANSEV_143_D142');
      expect(right?.click).toBeDefined();

      const originJson = {
        manualMeasurement: {
          enteredBy: 'citizen',
        },
      };

      const scope: any = {
        outputModel: {},
        nodeModel: {
          pulse: 68,
          origin: originJson,
        },
      };
      component.nodeForm.setValue({
        inputControls: [68],
      });

      //@ts-ignore
      right?.click(scope);

      const output = scope.outputModel['144.OXYGEN_FLOW'];
      expect(output.name).toBe('144.OXYGEN_FLOW');
      expect(output.type).toBe('Float');
      expect(output.value).toBeDefined();
      expect(output.value).toBe(68);

      const origin = scope.outputModel['144.OXYGEN_FLOW#ORIGIN'];
      expect(origin.name).toBe('144.OXYGEN_FLOW#ORIGIN');
      expect(origin.type).toBe('Object');
      expect(origin.value).toEqual(originJson);
    });

    it('should setup left button', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe('AN_142_CANCEL');
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('PeakFlowManualDeviceNode', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_143_D142',
      nextFail: 'AN_142_CANCEL',
      text: 'Mål dit peak flow og indtast resultatet i feltet nedenfor',
      peakFlow: {
        name: '144.PEAK_FLOW',
        type: 'Float',
      },
      origin: {
        name: '144.PEAK_FLOW#ORIGIN',
        type: 'Object',
      },
    };
    const nodeMap = { '144': { PeakFlowManualDeviceNode: node } };
    const parserTypeName = 'peakFlow';

    it('should parse node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toBe(
        'Mål dit peak flow og indtast resultatet i feltet nedenfor'
      );
      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should setup right button with click action', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe('ANSEV_143_D142');
      expect(right?.click).toBeDefined();

      const originJson = {
        manualMeasurement: {
          enteredBy: 'citizen',
        },
      };

      const scope: any = {
        outputModel: {},
        nodeModel: {
          peakFlow: 15,
          origin: originJson,
        },
      };
      component.nodeForm.setValue({
        inputControls: [15],
      });
      //@ts-ignore
      right?.click(scope);

      const output = scope.outputModel['144.PEAK_FLOW'];
      expect(output.name).toBe('144.PEAK_FLOW');
      expect(output.type).toBe('Float');
      expect(output.value).toBeDefined();
      expect(output.value).toBe(15);

      const origin = scope.outputModel['144.PEAK_FLOW#ORIGIN'];
      expect(origin.name).toBe('144.PEAK_FLOW#ORIGIN');
      expect(origin.type).toBe('Object');
      expect(origin.value).toEqual(originJson);
    });

    it('should setup left button', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe('AN_142_CANCEL');
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('PulseManualDeviceNode', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_143_D142',
      nextFail: 'AN_142_CANCEL',
      text: 'Measure your pulse',
      pulse: {
        name: '144.PULSE',
        type: 'Integer',
      },
      origin: {
        name: '144.PULSE#ORIGIN',
        type: 'Object',
      },
    };

    const nodeMap = { '144': { PulseManualDeviceNode: node } };
    const parserTypeName = 'pulse';

    it('should parse node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toBe('Measure your pulse');
      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should setup right button with click action', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe('ANSEV_143_D142');
      expect(right?.click).toBeDefined();

      const originJson = {
        manualMeasurement: {
          enteredBy: 'citizen',
        },
      };

      const scope: any = {
        outputModel: {},
        nodeModel: {
          pulse: 68,
          origin: originJson,
        },
      };

      component.nodeForm.setValue({
        inputControls: [68],
      });
      //@ts-ignore
      right.click(scope);

      const output = scope.outputModel['144.PULSE'];
      expect(output.name).toBe('144.PULSE');
      expect(output.type).toBe('Integer');
      expect(output.value).toBeDefined();
      expect(output.value).toBe(68);

      const origin = scope.outputModel['144.PULSE#ORIGIN'];
      expect(origin.name).toBe('144.PULSE#ORIGIN');
      expect(origin.type).toBe('Object');
      expect(origin.value).toEqual(originJson);
    });

    it('should setup left button', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe('AN_142_CANCEL');
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('can parse RespiratoryRateManualDeviceNode', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_143_D142',
      nextFail: 'AN_142_CANCEL',
      text: 'Mål din respirationsfrekvens og indtast resultatet i feltet nedenfor',
      respiratoryRate: {
        name: '144.RESPIRATORY_RATE',
        type: 'Float',
      },
      origin: {
        name: '144.RESPIRATORY_RATE#ORIGIN',
        type: 'Object',
      },
    };

    const nodeMap = { '144': { RespiratoryRateManualDeviceNode: node } };
    const parserTypeName = 'respiratoryRate';

    it('should parse node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toBe(
        'Mål din respirationsfrekvens og indtast resultatet i feltet nedenfor'
      );
      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should setup right button with click action', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe('ANSEV_143_D142');
      expect(right?.click).toBeDefined();

      const originJson = {
        manualMeasurement: {
          enteredBy: 'citizen',
        },
      };

      const scope: any = {
        outputModel: {},
        nodeModel: {
          respiratoryRate: 15,
          origin: originJson,
        },
      };

      component.nodeForm.setValue({
        inputControls: [15],
      });
      //@ts-ignore
      right.click(scope);

      const output = scope.outputModel['144.RESPIRATORY_RATE'];
      expect(output.name).toBe('144.RESPIRATORY_RATE');
      expect(output.type).toBe('Float');
      expect(output.value).toBeDefined();
      expect(output.value).toBe(15);

      const origin = scope.outputModel['144.RESPIRATORY_RATE#ORIGIN'];
      expect(origin.name).toBe('144.RESPIRATORY_RATE#ORIGIN');
      expect(origin.type).toBe('Object');
      expect(origin.value).toEqual(originJson);
    });

    it('should setup left button', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );
      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe('AN_142_CANCEL');
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('SitToStandManualDeviceNode', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_143_D142',
      nextFail: 'AN_142_CANCEL',
      text: 'How many repetitions did you perform?',
      sitToStand: {
        name: '144.SIT_TO_STAND',
        type: 'Integer',
      },
      origin: {
        name: '144.SIT_TO_STAND#ORIGIN',
        type: 'Object',
      },
    };

    const nodeMap = { '144': { SitToStandManualDeviceNode: node } };
    const parserTypeName = 'sitToStand';

    it('should parse node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toBe(
        'How many repetitions did you perform?'
      );
      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should setup right button with click action', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe('ANSEV_143_D142');
      expect(right?.click).toBeDefined();

      const originJson = {
        manualMeasurement: {
          enteredBy: 'citizen',
        },
      };

      const scope: any = {
        outputModel: {},
        nodeModel: {
          sitToStand: 15,
          origin: originJson,
        },
      };

      component.nodeForm.setValue({
        inputControls: [15],
      });
      //@ts-ignore
      right?.click(scope);

      const output = scope.outputModel['144.SIT_TO_STAND'];
      expect(output.name).toBe('144.SIT_TO_STAND');
      expect(output.type).toBe('Integer');
      expect(output.value).toBeDefined();
      expect(output.value).toBe(15);

      const origin = scope.outputModel['144.SIT_TO_STAND#ORIGIN'];
      expect(origin.name).toBe('144.SIT_TO_STAND#ORIGIN');
      expect(origin.type).toBe('Object');
      expect(origin.value).toEqual(originJson);
    });

    it('should setup left button', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe('AN_142_CANCEL');
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('TemperatureManualDeviceNode', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_143_D142',
      nextFail: 'AN_142_CANCEL',
      text: 'Mål din temperatur og indtast resultatet i feltet nedenfor',
      temperature: {
        name: '144.TEMPERATURE',
        type: 'Float',
      },
      origin: {
        name: '144.TEMPERATURE#ORIGIN',
        type: 'Object',
      },
    };

    const nodeMap = { '144': { TemperatureManualDeviceNode: node } };
    const parserTypeName = 'temperature';

    it('should parse node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toBe(
        'Mål din temperatur og indtast resultatet i feltet nedenfor'
      );
      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should setup right button with click action', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe('ANSEV_143_D142');
      expect(right?.click).toBeDefined();

      const originJson = {
        manualMeasurement: {
          enteredBy: 'citizen',
        },
      };

      const scope: any = {
        outputModel: {},
        nodeModel: {
          temperature: 37.5,
          origin: originJson,
        },
      };
      component.nodeForm.setValue({
        inputControls: [37.5],
      });
      //@ts-ignore
      right.click(scope);

      const output = scope.outputModel['144.TEMPERATURE'];
      expect(output.name).toBe('144.TEMPERATURE');
      expect(output.type).toBe('Float');
      expect(output.value).toBeDefined();
      expect(output.value).toBe(37.5);

      const origin = scope.outputModel['144.TEMPERATURE#ORIGIN'];
      expect(origin.name).toBe('144.TEMPERATURE#ORIGIN');
      expect(origin.type).toBe('Object');
      expect(origin.value).toEqual(originJson);
    });

    it('should setup left button', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe('AN_142_CANCEL');
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('can parse BodyCellMassManualDeviceNode', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_143_D142',
      nextFail: 'AN_142_CANCEL',
      text: 'What is your body cell mass?',
      bodyCellMass: {
        name: '144.BODY_CELL_MASS',
        type: 'Float',
      },
      origin: {
        name: '144.BODY_CELL_MASS#ORIGIN',
        type: 'Object',
      },
    };
    const nodeMap = { '144': { BodyCellMassManualDeviceNode: node } };
    const parserTypeName = 'bodyCellMass';

    it('should parse node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toBe(
        'What is your body cell mass?'
      );
      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should setup right button with click action', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe('ANSEV_143_D142');
      expect(right?.click).toBeDefined();

      const originJson = {
        manualMeasurement: {
          enteredBy: 'citizen',
        },
      };

      const scope: any = {
        outputModel: {},
        nodeModel: {
          bodyCellMass: 15,
          origin: originJson,
        },
      };
      component.nodeForm.setValue({
        inputControls: [15],
      });
      //@ts-ignore
      right?.click(scope);

      const output = scope.outputModel['144.BODY_CELL_MASS'];
      expect(output.name).toBe('144.BODY_CELL_MASS');
      expect(output.type).toBe('Float');
      expect(output.value).toBeDefined();
      expect(output.value).toBe(15);

      const origin = scope.outputModel['144.BODY_CELL_MASS#ORIGIN'];
      expect(origin.name).toBe('144.BODY_CELL_MASS#ORIGIN');
      expect(origin.type).toBe('Object');
      expect(origin.value).toEqual(originJson);
    });

    it('should setup left button', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe('AN_142_CANCEL');
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('WeightDeviceNode', () => {
    const node = {
      helpImage: null,
      helpText: null,
      origin: {
        type: 'Object',
        name: '279.WEIGHT#ORIGIN',
      },
      weight: {
        type: 'Float',
        name: '279.WEIGHT',
      },
      text: 'Tænd for vægten',
      nextFail: 'AN_279_CANCEL',
      next: 'ANSEV_280_D279',
      nodeName: '279',
    };

    const nodeMap = { '279': { WeightDeviceNode: node } };
    const parserTypeName = 'weight';

    it('should parse node', async () => {

      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toBe('Tænd for vægten');
      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should setup right button with click action', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe('ANSEV_280_D279');
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
          weight: 85.3,
          origin: originJson,
        },
      };

      component.nodeForm.setValue({
        inputControls: [85.3],
      });
      //@ts-ignore
      right?.click(scope);

      const weight = scope.outputModel['279.WEIGHT'];
      expect(weight.name).toBe('279.WEIGHT');
      expect(weight.type).toBe('Float');
      expect(weight.value).toBe(85.3);

      const origin = scope.outputModel['279.WEIGHT#ORIGIN'];
      expect(origin.name).toBe('279.WEIGHT#ORIGIN');
      expect(origin.type).toBe('Object');
      expect(origin.value).toEqual(originJson);
    });

    it('should setup left button', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe('AN_279_CANCEL');
    });
  });
});
