import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  NodeComponent,
  ComponentParameters,
  NodeType,
} from 'src/app/types/nodes.type';
import { QuestionnaireScope } from 'src/app/types/model.type';
import {
  QuestionnaireNode,
  NodeMap,
  Representation,
  RepresentationType,
  UnsupportedRepresentation,
} from 'src/app/types/parser.type';

@Component({
  selector: 'app-unsupported-node',
  templateUrl: './unsupported-node.component.html',
  styleUrls: ['./unsupported-node.component.less'],
})
export class UnsupportedNodeComponent implements NodeComponent {
  @Input() node!: QuestionnaireNode;
  @Input() nodeMap!: NodeMap;
  @Input() scope!: QuestionnaireScope;
  @Input() parameters!: ComponentParameters;

  title: string = 'Oops...';
  error: string = '';

  constructor(private router: Router, private translate: TranslateService) {}

  getRepresentation(): Representation {
    if (this.parameters?.nodeTypeName && this.parameters?.noNative) {
      this.error = this.translate
      .instant('NO_NATIVE_LAYER')
      .replace('{0}', this.parameters.nodeTypeName);
    } else if (this.parameters?.type && this.parameters?.nodeTypeName) {
      switch (this.parameters?.type) {
        case NodeType.AUTOMATIC: {
          this.error = this.translate
            .instant('AUTOMATIC_DEVICE_NOT_SUPPORTED')
            .replace('{0}', this.parameters.nodeTypeName);
          break;
        }
        case NodeType.MANUAL: {
          this.error = this.translate
            .instant('MANUAL_DEVICE_NOT_SUPPORTED')
            .replace('{0}', this.parameters.nodeTypeName);
          break;
        }
        case NodeType.UNKNOWN:
        default: {
          // Unknown
          this.error = this.translate
            .instant('DEVICE_NOT_SUPPORTED')
            .replace('{0}', this.parameters.nodeTypeName);
          break;
        }
      }
    } else {
      this.error = `${this.translate.instant(
        'UNKNOWN'
      )} ${this.translate.instant('ERROR_TITLE')}`;
    }

    const representation: UnsupportedRepresentation = {
      kind: RepresentationType.UNSUPPORTED,
      nodeModel: { nodeId: 'unsupported-node' },
      centerButton: {
        show: true,
        text: 'OK',
        click: () => {
          this.router.navigate(['/menu']);
        },
        validate: () => {
          return true;
        },
        nextNodeId: RepresentationType.UNSUPPORTED,
      },
    };

    return representation;
  }
}
