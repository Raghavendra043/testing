import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NodeRepresentation } from '@app/types/parser.type';
import { HeaderModule } from '@components/header/header.module';
import { NotificationsModule } from '@components/notifications/notifications.module';
import { TranslateModule } from '@ngx-translate/core';

import { EndNodeComponent } from './end-node.component';

describe('EndNodeComponent', () => {
  let component: EndNodeComponent;
  let fixture: ComponentFixture<EndNodeComponent>;

  const node = {
    nodeName: '159',
  };

  async function init(): Promise<NodeRepresentation> {
    await TestBed.configureTestingModule({
      declarations: [EndNodeComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        HeaderModule,
        NotificationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EndNodeComponent);

    component = fixture.componentInstance;
    component.node = node;
    component.nodeMap = { '159': { EndNode: node } };
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

  describe('can parse EndNode', () => {
    it('should parse EndNode', async () => {
      const representation: NodeRepresentation = await init();

      expect(representation).toBeDefined();
      expect(representation.nodeModel.nodeId).toEqual('159');
    });
  });
});
