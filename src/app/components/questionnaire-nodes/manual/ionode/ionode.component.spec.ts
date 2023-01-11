import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { IONodeComponent } from './ionode.component';

describe('IONodeComponent', () => {
  let component: IONodeComponent;
  let fixture: ComponentFixture<IONodeComponent>;

  const assertOutputModel = (fakeScope: any) => {
    expect(fakeScope.outputModel['199.SAT#SATURATION']).toBeDefined();
    expect(fakeScope.outputModel['199.SAT#SATURATION'].value).toBe(1234);
    expect(fakeScope.outputModel['199.SAT#SATURATION'].type).toBe('Integer');
    expect(fakeScope.outputModel['199.SAT#SATURATION'].name).toBe(
      '199.SAT#SATURATION'
    );

    expect(fakeScope.outputModel['199.SAT#PULSE']).toBeDefined();
    expect(fakeScope.outputModel['199.SAT#PULSE'].value).toBe('42');
    expect(fakeScope.outputModel['199.SAT#PULSE'].type).toBe('String');
    expect(fakeScope.outputModel['199.SAT#PULSE'].name).toBe('199.SAT#PULSE');

    expect(fakeScope.outputModel['199.SAT#WEIGHT']).toBeDefined();
    expect(fakeScope.outputModel['199.SAT#WEIGHT'].value).toBe(34.56);
    expect(fakeScope.outputModel['199.SAT#WEIGHT'].type).toBe('Float');
    expect(fakeScope.outputModel['199.SAT#WEIGHT'].name).toBe('199.SAT#WEIGHT');
  };

  const runAndAssertValidationTest = (
    component: any,
    parsed: any,
    fakeScope: any
  ) => {
    fakeScope.nodeForm = {
      input_number_1349593812: {
        $valid: true,
      },
      input_text_2012267999: {
        $valid: false,
      },
      input_number_1858674478: {
        $valid: true,
      },
    };
    component.nodeForm.setValue({
      //@ts-ignore
      inputControls: [1234, 34.56],
      textInputControls: [''],
    });

    expect(parsed.rightButton.validate(fakeScope)).toBe(false);
    component.nodeForm.setValue({
      //@ts-ignore
      inputControls: ['', ''],
      textInputControls: ['true'],
    });
    expect(parsed.rightButton.validate(fakeScope)).toBe(false);
    component.nodeForm.setValue({
      //@ts-ignore
      inputControls: ['', ''],
      textInputControls: [''],
    });
    expect(parsed.rightButton.validate(fakeScope)).toBe(false);
    component.nodeForm.setValue({
      //@ts-ignore
      inputControls: [1234, 34.56],
      textInputControls: ['true'],
    });
    expect(parsed.rightButton.validate(fakeScope)).toBe(true);
  };

  async function init(node: any, nodeMap: any) {
    await TestBed.configureTestingModule({
      declarations: [IONodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(IONodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = nodeMap;
    //@ts-ignore
    component.scope = { hasOffendingValue: () => false };
    //@ts-ignore
    component.parameters = undefined;
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }

  it('should parse IONode with one TextViewElement and one ButtonElement', async () => {
    const node = {
      nodeName: '157',
      elements: [
        {
          TextViewElement: {
            text: 'Så skal der måles blodsukker!',
          },
        },
        {
          ButtonElement: {
            text: 'Næste',
            gravity: 'center',
            next: '159',
          },
        },
      ],
    };
    const nodeMap = { '157': { IONode: node } };
    await init(node, nodeMap);
    //@ts-ignore
    const representation: NodeRepresentation = component.getRepresentation();

    expect(representation).toBeDefined();
    expect(representation?.nodeModel.nodeId).toEqual('157');
    expect(component.labels[0]).toMatch(/Så skal der måles blodsukker/);
    expect(representation?.centerButton?.text).toEqual('Næste');
    expect(representation?.centerButton?.nextNodeId).toEqual('159');
    expect(representation?.leftButton).not.toBeDefined();
    expect(representation?.rightButton).not.toBeDefined();
  });

  it('should parse IONode with three ButtonElements', async () => {
    const node = {
      nodeName: '157',
      elements: [
        {
          ButtonElement: { text: 'Afbryd', gravity: 'left', next: '161' },
        },
        {
          ButtonElement: { text: 'Næste', gravity: 'center', next: '159' },
        },
        {
          ButtonElement: { text: 'Afslut', gravity: 'right', next: '162' },
        },
      ],
    };
    const nodeMap = { '157': { IONode: node } };

    await init(node, nodeMap);
    //@ts-ignore
    const representation: NodeRepresentation = component.getRepresentation();

    expect(representation).toBeDefined();
    expect(representation?.leftButton?.text).toEqual('Afbryd');
    expect(representation?.leftButton?.nextNodeId).toEqual('161');
    expect(representation?.centerButton?.text).toEqual('Næste');
    expect(representation?.centerButton?.nextNodeId).toEqual('159');
    expect(representation?.rightButton?.text).toEqual('Afslut');
    expect(representation?.rightButton?.nextNodeId).toEqual('162');
  });

  it('should parse IONode with two TextViewElements', async () => {
    const node = {
      nodeName: '157',
      elements: [
        {
          TextViewElement: { text: 'Så skal der måles blodsukker!' },
        },
        {
          TextViewElement: { text: 'Så skal der ogpå måles noget andet!' },
        },
      ],
    };
    const nodeMap = { '157': { IONode: node } };

    await init(node, nodeMap);
    //@ts-ignore
    const representation: NodeRepresentation = component.getRepresentation();

    expect(representation).toBeDefined();
    expect(component.labels[0]).toMatch(/Så skal der måles blodsukker/);
    expect(component.labels[1]).toMatch(/Så skal der ogpå måles noget andet/);
  });

  it('should parse IONode with HelpTextElement', async () => {
    const node = {
      nodeName: '199',
      elements: [
        {
          HelpTextElement: {
            text: 'Help text',
            image: 'http://localhost:8080/clinician/api/help-texts/1/image',
          },
        },
      ],
    };

    const nodeMap = { '199': { IONode: node } };

    await init(node, nodeMap);
    //@ts-ignore
    const representation: NodeRepresentation = component.getRepresentation();

    expect(representation).toBeDefined();
    const helpMenu = representation.helpMenu;
    expect(helpMenu).toBeDefined();
    expect(helpMenu?.text).toEqual('Help text');
    expect(helpMenu?.image).toEqual(
      'http://localhost:8080/clinician/api/help-texts/1/image'
    );
  });

  it('should throw exception on unsupported EditTextElement type', async () => {
    const node = {
      nodeName: '199',
      elements: [
        {
          EditTextElement: {
            outputVariable: {
              name: '199.SAT#SATURATION',
              type: 'CheckBox',
            },
          },
        },
      ],
    };

    const nodeMap = { '199': { IONode: node } };
    await init(node, nodeMap);
    expect(function () {
      component.getRepresentation();
    }).toThrowError();
  });

  describe('Template replace', () => {
    it('should parse IONode with Integer EditTextElements', async () => {
      const node = {
        nodeName: '199',
        elements: [
          {
            EditTextElement: {
              outputVariable: {
                name: '199.SAT#SATURATION',
                type: 'Integer',
              },
            },
          },
        ],
      };
      const nodeMap = { '199': { IONode: node } };
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();

      expect(representation).toBeDefined();
      const input = component.inputs[0];
      expect(input.name).toMatch(/input_number_\d+.*/);

      expect(input.type).toMatch(/number/);
      expect(input.step).toMatch(/1/);
    });

    it('should parse IONode with String EditTextElements', async () => {
      const node = {
        nodeName: '199',
        elements: [
          {
            EditTextElement: {
              outputVariable: {
                name: '199.SAT#SATURATION',
                type: 'String',
              },
            },
          },
        ],
      };
      const nodeMap = { '199': { IONode: node } };
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();

      expect(representation).toBeDefined();
      const input = component.textInputs[0];
      expect(input.name).toMatch(/input_text_\d+.*/);
      expect(input.type).toMatch(/text/);
    });

    it('should parse IONode with Float EditTextElements', async () => {
      const node = {
        nodeName: '199',
        elements: [
          {
            EditTextElement: {
              outputVariable: {
                name: '199.SAT#SATURATION',
                type: 'Float',
              },
            },
          },
        ],
      };
      const nodeMap = { '199': { IONode: node } };
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();
      expect(representation).toBeDefined();
      const input = component.inputs[0];
      expect(input.name).toMatch(/input_number_\d+.*/);
      expect(input.type).toMatch(/number/);
      expect(input.step).toMatch(/any/);
    });
  });

  describe('IONode TwoButtonElement assignment and validation', () => {
    let node: any, nodeMap: any, fakeScope: any;

    beforeEach(() => {
      node = {
        nodeName: '199',
        elements: [
          {
            EditTextElement: {
              outputVariable: {
                name: '199.SAT#SATURATION',
                type: 'Integer',
              },
            },
          },
          {
            EditTextElement: {
              outputVariable: {
                name: '199.SAT#PULSE',
                type: 'String',
              },
            },
          },
          {
            EditTextElement: {
              outputVariable: {
                name: '199.SAT#WEIGHT',
                type: 'Float',
              },
            },
          },
          {
            TwoButtonElement: {
              leftText: 'Undlad',
              leftNext: 'AN_199_CANCEL',
              leftSkipValidation: true,
              rightText: 'Næste',
              rightNext: 'ANSEV_200_D199',
              rightSkipValidation: false,
            },
          },
        ],
      };
      nodeMap = { '199': { IONode: node } };

      fakeScope = {
        nodeModel: {
          input_number_1349593812: 1234,
          input_text_2012267999: '42',
          input_number_1858674478: 34.56,
        },
        outputModel: {},
      };
    });

    it('should assign click action to next button', async () => {
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();

      expect(representation?.rightButton?.nextNodeId).toBe('ANSEV_200_D199');
      expect(representation?.rightButton?.text).toBe('Næste');
      expect(representation?.rightButton?.click).toBeDefined();
    });

    it('should assign EditTextElement inputs to output model when next clicked', async () => {
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();
      component.nodeForm.setValue({
        //@ts-ignore
        inputControls: [1234, 34.56],
        textInputControls: ['42'],
      });
      //@ts-ignore
      representation?.rightButton?.click(fakeScope);

      assertOutputModel(fakeScope);
    });

    it('should not assign values when omit is called', async () => {
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();

      expect(representation?.leftButton?.nextNodeId).toBe('AN_199_CANCEL');
      expect(representation?.leftButton?.text).toBe('Undlad');
      expect(representation?.leftButton?.click).not.toBeDefined();
    });

    it('should assign validate action to next button', async () => {
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();

      expect(representation?.leftButton?.validate).not.toBeDefined();
      expect(representation?.rightButton?.validate).toBeDefined();
    });

    it('should invoke all validate actions when next clicked', async () => {
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();

      runAndAssertValidationTest(component, representation, fakeScope);
    });
  });

  describe('IONode ButtonElement assignment and validation', () => {
    let node: any, nodeMap: any, fakeScope: any;

    beforeEach(() => {
      node = {
        nodeName: '199',
        elements: [
          {
            EditTextElement: {
              outputVariable: {
                name: '199.SAT#SATURATION',
                type: 'Integer',
              },
            },
          },
          {
            EditTextElement: {
              outputVariable: {
                name: '199.SAT#PULSE',
                type: 'String',
              },
            },
          },
          {
            EditTextElement: {
              outputVariable: {
                name: '199.SAT#WEIGHT',
                type: 'Float',
              },
            },
          },
          {
            ButtonElement: {
              text: 'Næste',
              gravity: 'right',
              next: '162',
            },
          },
          {
            ButtonElement: {
              text: 'Afbryd',
              gravity: 'left',
              next: '163',
              skipValidation: true,
            },
          },
        ],
      };

      nodeMap = { '199': { IONode: node } };

      fakeScope = {
        nodeModel: {
          input_number_1349593812: 1234,
          input_text_2012267999: '42',
          input_number_1858674478: 34.56,
        },
        outputModel: {},
      };
    });

    it('should assign click actions and validation actions to button click', async () => {
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();

      expect(representation?.rightButton?.nextNodeId).toBe('162');
      expect(representation?.rightButton?.click).toBeDefined();
      expect(representation?.rightButton?.validate).toBeDefined();
    });

    it('should assign to output model when click action is invoked', async () => {
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();
      component.nodeForm.setValue({
        //@ts-ignore
        inputControls: [1234, 34.56],
        textInputControls: ['42'],
      });
      //@ts-ignore
      representation?.rightButton.click(fakeScope);
      assertOutputModel(fakeScope);
    });

    it('should invoke all validate actions when next clicked', async () => {
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();

      runAndAssertValidationTest(component, representation, fakeScope);
    });

    it('should not assign any click actions when skipValidation is true', async () => {
      await init(node, nodeMap);
      //@ts-ignore
      const representation: NodeRepresentation = component.getRepresentation();

      expect(representation?.leftButton?.nextNodeId).toBe('163');
      expect(representation?.leftButton?.click).not.toBeDefined();
      expect(representation?.leftButton?.validate).not.toBeDefined();
    });
  });
});
