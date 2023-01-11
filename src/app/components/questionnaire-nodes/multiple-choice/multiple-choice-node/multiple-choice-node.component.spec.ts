import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { MultipleChoiceNodeComponent } from './multiple-choice-node.component';

describe('MultipleChoiceNodeComponent', () => {
  let component: MultipleChoiceNodeComponent;
  let fixture: ComponentFixture<MultipleChoiceNodeComponent>;

  async function init(node: any): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [MultipleChoiceNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MultipleChoiceNodeComponent);

    component = fixture.componentInstance;
    //@ts-ignore
    component.node = node;
    component.nodeMap = { '100': { MultipleChoiceNode: node } };
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

  describe('can parse MultipleChoiceNode', () => {
    const node = {
      nodeName: '100',
      branchOnChoices: false,
      next: '101',
      question: 'How often do you scratch your head?',
      answer: {
        name: '100.MULTIPLE_CHOICE',
        type: 'String',
        choices: [
          {
            value: 'All',
            text: 'All of the time',
          },
          {
            value: 'Most',
            text: 'Most of the time',
          },
          {
            value: 'Some',
            text: 'Some of the time',
          },
        ],
      },
    };
    const fakeScope = {
      nodeModel: {},
      model: {
        centerButton: {},
      },
      outputModel: {},
    };

    it('should parse node', async () => {
      const representation: NodeRepresentation = await init(node);

      expect(representation).toBeDefined();
      expect(representation.nodeModel.heading).toBe(
        'How often do you scratch your head?'
      );
      expect(representation.leftButton).toBeUndefined();
      expect(representation.centerButton).toBeDefined();
    });

    it('should return false when validating', async () => {
      const representation: NodeRepresentation = await init(node);

      expect(representation?.centerButton?.validate).toBeDefined();
      //@ts-ignore
      expect(representation?.centerButton?.validate(fakeScope)).toBe(false);
    });

    it('should assign selected element to output model when next clicked', async () => {
      const representation: NodeRepresentation = await init(node);
      //@ts-ignore
      fakeScope.nodeModel.selectedIndex = 1;
      component.nodeForm.setValue({
        selectedIndex: 1,
      });
      //@ts-ignore
      representation?.centerButton?.click(fakeScope);
      //@ts-ignore
      expect(representation.centerButton.validate(fakeScope)).toBe(true);
      expect(fakeScope.outputModel['100']).toBeDefined();
      expect(fakeScope.outputModel['100'].name).toBe('100.MULTIPLE_CHOICE');
      expect(fakeScope.outputModel['100'].value).toBe('Most');
      expect(fakeScope.outputModel['100'].type).toBe('String');

      //@ts-ignore
      expect(fakeScope?.model?.centerButton?.nextNodeId).toBe('101');
    });
  });

  describe('can branch depending on selected choice', () => {
    const node = {
      nodeName: '100',
      branchOnChoices: true,
      question: 'How often do you scratch your head?',
      answer: {
        name: '100.MULTIPLE_CHOICE',
        type: 'String',
        choices: [
          {
            value: 'All',
            text: 'All of the time',
            next: '101',
          },
          {
            value: 'Most',
            text: 'Most of the time',
            next: '102',
          },
          {
            value: 'Some',
            text: 'Some of the time',
            next: '103',
          },
        ],
      },
    };

    const fakeScope = {
      nodeModel: {},
      model: {
        centerButton: {},
      },
      outputModel: {},
    };

    it('should assign next of selected element to nextNodeId when next clicked', async () => {
      const representation: NodeRepresentation = await init(node);
      //@ts-ignore
      fakeScope.nodeModel.selectedIndex = 0;
      component.nodeForm.setValue({
        selectedIndex: 0,
      });
      //@ts-ignore
      representation.centerButton.click(fakeScope);
      //@ts-ignore
      expect(representation.centerButton.validate(fakeScope)).toBe(true);
      //@ts-ignore
      expect(fakeScope?.model?.centerButton?.nextNodeId).toBe('101');
      //@ts-ignore
      fakeScope.nodeModel.selectedIndex = 1;
      component.nodeForm.setValue({
        selectedIndex: 1,
      });
      //@ts-ignore
      representation?.centerButton?.click(fakeScope);
      //@ts-ignore
      expect(representation?.centerButton?.validate(fakeScope)).toBe(true);
      //@ts-ignore
      expect(fakeScope?.model?.centerButton?.nextNodeId).toBe('102');
      //@ts-ignore
      fakeScope.nodeModel.selectedIndex = 2;
      component.nodeForm.setValue({
        selectedIndex: 2,
      });
      //@ts-ignore
      representation.centerButton.click(fakeScope);
      //@ts-ignore
      expect(representation.centerButton.validate(fakeScope)).toBe(true);
      //@ts-ignore
      expect(fakeScope?.model?.centerButton?.nextNodeId).toBe('103');
    });
  });
});
