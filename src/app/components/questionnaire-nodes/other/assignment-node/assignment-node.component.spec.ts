import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation, SkipRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { AssignmentNodeComponent } from './assignment-node.component';

describe('AssignmentNodeComponent', () => {
  let component: AssignmentNodeComponent;
  let fixture: ComponentFixture<AssignmentNodeComponent>;

  async function init(node: any, nodeMap: any): Promise<SkipRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [AssignmentNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AssignmentNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = nodeMap;
    //@ts-ignore
    component.scope = { outputModel: {} };
    //@ts-ignore
    component.parameters = undefined;
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    //@ts-ignore
    const representation: SkipRepresentation = component.getRepresentation();
    return representation;
  }

  it('should execute boolean assignment', async () => {
    const node = {
      nodeName: 'AN_158_CANCEL',
      next: '159',
      variable: {
        name: '158.BS##CANCEL',
        type: 'Boolean',
      },
      expression: {
        type: 'Boolean',
        value: true,
      },
    };

    const nextNode = {
      EndNode: {
        nodeName: '159',
      },
    };
    const nodeMap = {
      AN_158_CANCEL: { AssignmentNode: node },
      '159': nextNode,
    };

    const representation: SkipRepresentation = await init(node, nodeMap);

    expect(representation.nextNodeId).toBe('159');
    const outputModel = component.scope.outputModel;
    expect(outputModel['158.BS##CANCEL']).toBeDefined();
    expect(outputModel['158.BS##CANCEL'].name).toBe('158.BS##CANCEL');
    //@ts-ignore
    expect(outputModel['158.BS##CANCEL'].value).toBe(true);
    expect(outputModel['158.BS##CANCEL'].type).toBe('Boolean');
  });

  it('should execute string assignment', async () => {
    const node = {
      nodeName: 'AN_158_CANCEL',
      next: '159',
      variable: {
        name: '158.BS##CANCEL',
        type: 'String',
      },
      expression: { type: 'String', value: 'assign me' },
    };

    const nextNode = {
      EndNode: {
        nodeName: '159',
      },
    };

    const nodeMap = {
      AN_158_CANCEL: { AssignmentNode: node },
      '159': nextNode,
    };

    const representation: SkipRepresentation = await init(node, nodeMap);
    expect(representation.nextNodeId).toBe('159');

    const outputModel = component.scope.outputModel;
    expect(outputModel['158.BS##CANCEL']).toBeDefined();
    expect(outputModel['158.BS##CANCEL'].name).toBe('158.BS##CANCEL');
    expect(outputModel['158.BS##CANCEL'].value).toBe('assign me');
    expect(outputModel['158.BS##CANCEL'].type).toBe('String');
  });

  xit('should keep parsing nodes until a non-assignment node is reached', async () => {
    // TODO: This logic now lies in the questionnaire component
    const node = {
      nodeName: 'AN_158_CANCEL',
      next: 'AN_NEXT',
      variable: {
        name: '158.BS##CANCEL',
        type: 'Boolean',
      },
      expression: { type: 'Boolean', value: true },
    };

    const nextNode = {
      nodeName: 'AN_NEXT',
      next: '159',
      variable: {
        name: 'AN##NEXT',
        type: 'String',
      },
      expression: { type: 'String', value: 'assign me' },
    };

    const lastNode = {
      EndNode: {
        nodeName: '159',
      },
    };

    const nodeMap = {
      AN_158_CANCEL: { AssignmentNode: node },
      AN_NEXT: { AssignmentNode: nextNode },
      '159': lastNode,
    };

    const representation: SkipRepresentation = await init(node, nodeMap);

    const outputModel = component.scope.outputModel;

    // expect(representation.nodeId).toBe('159');
    // expect(representation.isEndNode).toBe(true);
    expect(outputModel['158.BS##CANCEL']).toBeDefined();
    expect(outputModel['AN##NEXT']).toBeDefined();
  });
    
});
