import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { MultipleChoiceQuestionNodeComponent } from './multiple-choice-question-node.component';

describe('MultipleChoiceQuestionNodeComponent', () => {
  let component: MultipleChoiceQuestionNodeComponent;
  let fixture: ComponentFixture<MultipleChoiceQuestionNodeComponent>;

  async function init(node: any): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [MultipleChoiceQuestionNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MultipleChoiceQuestionNodeComponent);

    component = fixture.componentInstance;
    //@ts-ignore
    component.node = node;
    component.nodeMap = { '100': { MultipleChoiceQuestionNode: node } };
    //@ts-ignore
    component.scope = {
      outputModel: {},
    };
    //@ts-ignore
    component.parameters = undefined;
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    //@ts-ignore
    const representation: NodeRepresentation = component.getRepresentation();
    return representation;
  }
  describe('can parse MultipleChoiceQuestionNode', () => {
    const node = {
      nodeName: '100',
      question: 'How often do you scratch your head?',
      next: '101',
      answer: {
        name: '100.MULTIPLE_CHOICE_QUESTION',
        type: 'Integer',
        choices: [
          {
            value: 3,
            text: 'All of the time',
          },

          {
            value: 2,
            text: 'Most of the time',
          },

          {
            value: 1,
            text: 'Some of the time',
          },
        ],
      },
    };

    const fakeScope = {
      nodeModel: {
        selectedIndex: -1,
      },
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
      expect(representation?.centerButton?.nextNodeId).toBe('101');
      expect(representation?.centerButton?.click).toBeDefined();
    });

    it('should return false when validating', async () => {
      const representation: NodeRepresentation = await init(node);

      expect(representation?.centerButton?.validate).toBeDefined();
      //@ts-ignore
      expect(representation?.centerButton?.validate(fakeScope)).toBe(false);
    });

    it('should assign selected element to output model when next clicked', async () => {
      const representation: NodeRepresentation = await init(node);
      component.nodeForm.setValue({
        selectedIndex: 1,
      });
      //@ts-ignore
      representation.centerButton.click();
      //@ts-ignore
      expect(representation.centerButton.validate()).toBe(true);

      const outputModel = component.scope.outputModel;
      expect(outputModel['100.MULTIPLE_CHOICE_QUESTION']).toBeDefined();
      expect(outputModel['100.MULTIPLE_CHOICE_QUESTION'].name).toBe(
        '100.MULTIPLE_CHOICE_QUESTION'
      );
      //@ts-ignore
      expect(outputModel['100.MULTIPLE_CHOICE_QUESTION'].value).toBe(2);
      expect(outputModel['100.MULTIPLE_CHOICE_QUESTION'].type).toBe('Integer');
    });
  });
});
