import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { EnumDeviceNodeComponent } from './enum-device-node.component';

describe('EnumDeviceNodeComponent: ', () => {
  let component: EnumDeviceNodeComponent;
  let fixture: ComponentFixture<EnumDeviceNodeComponent>;

  async function init(
    node: any,
    nodeMap: any,
    parserTypeName: string
  ): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [EnumDeviceNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EnumDeviceNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = nodeMap; //{ '146': { type: node } };

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

  describe('UrineBloodManualDeviceNode', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_112_D110',
      nextFail: 'AN_110_CANCEL',
      text: 'Indtast resultatet fra din urinundersøgelse\nBlod',
      bloodUrine: {
        name: '110.BLOOD_URINE',
        type: 'Integer',
      },
    };
    const nodeMap = { '144': { BloodUrineManualDeviceNode: node } };
    const parserTypeName = 'bloodUrine';

    it('should parse node urine blood node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toMatch(
        /Indtast resultatet fra din urinundersøgelse/
      );

      expect(component.enum.value).toBeFalsy();
      const enums = [
        'URINE_LEVEL_NEGATIVE',
        'URINE_LEVEL_PLUS_MINUS',
        'URINE_LEVEL_PLUS_ONE',
        'URINE_LEVEL_PLUS_TWO',
        'URINE_LEVEL_PLUS_THREE',
      ];
      for (const [i, value] of component.inputs.entries()) {
        expect(value.level).toEqual(enums[i]);
      }
      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should assign to output model when right button clicked', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe(node.next);
      expect(right?.click).toBeDefined();

      const scope = {
        outputModel: {
          '110.BLOOD_URINE': {},
        },
        nodeModel: {
          bloodUrine: 0,
        },
      };
      component.nodeForm.setValue({
        enum: '0',
      });
      //@ts-ignore
      right.click(scope);

      const output: any = scope.outputModel['110.BLOOD_URINE'];
      expect(output.type).toBe('Integer');
      expect(output.value).toBe(0);
    });

    it('should have a cancel button setup', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe(node.nextFail);
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('UrineGlucoseManualDeviceNodeParser', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_112_D110',
      nextFail: 'AN_110_CANCEL',
      text: 'Indtast resultatet fra din urinundersøgelse\nGlukose (sukker)',
      glucoseUrine: {
        name: '110.GLUCOSE_URINE',
        type: 'Integer',
      },
    };
    const nodeMap = { '144': { GlucoseUrineManualDeviceNode: node } };
    const parserTypeName = 'glucoseUrine';

    it('should parse node urine glucose node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toMatch(
        /Indtast resultatet fra din urinundersøgelse/
      );

      expect(component.enum.value).toBeFalsy();
      const enums = [
        'URINE_LEVEL_NEGATIVE',
        'URINE_LEVEL_PLUS_ONE',
        'URINE_LEVEL_PLUS_TWO',
        'URINE_LEVEL_PLUS_THREE',
        'URINE_LEVEL_PLUS_FOUR',
      ];
      for (const [i, value] of component.inputs.entries()) {
        expect(value.level).toEqual(enums[i]);
      }

      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should assign to output model when right button clicked', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe(node.next);
      expect(right?.click).toBeDefined();

      const scope: any = {
        outputModel: {
          '110.GLUCOSE_URINE': {},
        },
        nodeModel: {
          glucoseUrine: 2,
        },
      };

      component.nodeForm.setValue({
        enum: '2',
      });
      //@ts-ignore
      right.click(scope);

      const output = scope.outputModel['110.GLUCOSE_URINE'];
      expect(output.type).toBe('Integer');
      expect(output.value).toBe(2);
    });

    it('should have a cancel button setup', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe(node.nextFail);
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('UrineLeukocytesManualDeviceNodeParser', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_112_D110',
      nextFail: 'AN_110_CANCEL',
      text: 'Indtast resultatet fra din urinundersøgelse\nLeukocytes',
      leukocytesUrine: {
        name: '110.LEUKOCYTES_URINE',
        type: 'Integer',
      },
    };
    const nodeMap = { '144': { LeukocytesUrineManualDeviceNode: node } };
    const parserTypeName = 'leukocytesUrine';

    it('should parse node urine leukocytes node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toMatch(
        /Indtast resultatet fra din urinundersøgelse/
      );
      expect(component.enum.value).toBeFalsy();
      const enums = [
        'URINE_LEVEL_NEGATIVE',
        'URINE_LEVEL_PLUS_ONE',
        'URINE_LEVEL_PLUS_TWO',
        'URINE_LEVEL_PLUS_THREE',
        'URINE_LEVEL_PLUS_FOUR',
      ];
      for (const [i, value] of component.inputs.entries()) {
        expect(value.level).toEqual(enums[i]);
      }

      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should assign to output model when right button clicked', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe(node.next);
      expect(right?.click).toBeDefined();

      const scope = {
        outputModel: {
          '110.LEUKOCYTES_URINE': {},
        },
        nodeModel: {
          leukocytesUrine: 3,
        },
      };
      component.nodeForm.setValue({
        enum: '3',
      });
      //@ts-ignore
      right?.click(scope);

      const output: any = scope.outputModel['110.LEUKOCYTES_URINE'];
      expect(output.type).toBe('Integer');
      expect(output.value).toBe(3);
    });

    it('should have a cancel button setup', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe(node.nextFail);
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('UrineManualDeviceNodeParser', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_132_D131',
      nextFail: 'AN_131_CANCEL',
      text: 'Mål proteinindholdet i din urin og indtast resultatet nedenfor',
      urine: {
        name: '131.URINE',
        type: 'Integer',
      },
    };
    const nodeMap = { '144': { UrineManualDeviceNode: node } };
    const parserTypeName = 'urine';

    it('should parse node urine protein node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toMatch(
        /Mål proteinindholdet i din urin/
      );
      expect(component.enum.value).toBeFalsy();
      const enums = [
        'URINE_LEVEL_NEGATIVE',
        'URINE_LEVEL_PLUS_MINUS',
        'URINE_LEVEL_PLUS_ONE',
        'URINE_LEVEL_PLUS_TWO',
        'URINE_LEVEL_PLUS_THREE',
        'URINE_LEVEL_PLUS_FOUR',
      ];
      for (const [i, value] of component.inputs.entries()) {
        expect(value.level).toEqual(enums[i]);
      }

      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should assign to output model when right button clicked', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe(node.next);
      expect(right?.click).toBeDefined();

      const scope = {
        outputModel: {
          '131.URINE': {},
        },
        nodeModel: {
          urine: 2,
        },
      };
      component.nodeForm.setValue({
        enum: '2',
      });
      //@ts-ignore
      right.click(scope);

      const output: any = scope.outputModel['131.URINE'];
      expect(output.type).toBe('Integer');
      expect(output.value).toBe(2);
    });

    it('should have a cancel button setup', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe(node.nextFail);
      expect(left?.click).not.toBeDefined();
    });
  });

  describe('UrineNitriteManualDeviceNodeParser', () => {
    const node = {
      nodeName: '144',
      next: 'ANSEV_112_D110',
      nextFail: 'AN_110_CANCEL',
      text: 'Indtast resultatet fra din urinundersøgelse\nNitrite',
      nitriteUrine: {
        name: '110.NITRITE_URINE',
        type: 'Integer',
      },
    };
    const nodeMap = { '144': { NitriteUrineManualDeviceNode: node } };
    const parserTypeName = 'nitriteUrine';

    it('should parse node urine nitrite node', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toMatch(
        /Indtast resultatet fra din urinundersøgelse/
      );
      expect(component.enum.value).toBeFalsy();
      const enums = ['URINE_LEVEL_NEGATIVE', 'URINE_LEVEL_POSITIVE'];
      for (const [i, value] of component.inputs.entries()) {
        expect(value.level).toEqual(enums[i]);
      }

      expect(representation.leftButton).toBeDefined();
      expect(representation.rightButton).toBeDefined();
    });

    it('should assign to output model when right button clicked', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const right = representation.rightButton;
      expect(right?.text).toBe('NEXT');
      expect(right?.nextNodeId).toBe(node.next);
      expect(right?.click).toBeDefined();

      const scope = {
        outputModel: {
          '110.NITRITE_URINE': {},
        },
        nodeModel: {
          nitriteUrine: 1,
        },
      };
      component.nodeForm.setValue({
        enum: '1',
      });
      //@ts-ignore
      right.click(scope);

      const output: any = scope.outputModel['110.NITRITE_URINE'];
      expect(output.type).toBe('Integer');
      expect(output.value).toBe(1);
    });

    it('should have a cancel button setup', async () => {
      const representation: NodeRepresentation = await init(
        node,
        nodeMap,
        parserTypeName
      );

      const left = representation.leftButton;
      expect(left?.text).toBe('SKIP');
      expect(left?.nextNodeId).toBe(node.nextFail);
      expect(left?.click).not.toBeDefined();
    });
  });
});
