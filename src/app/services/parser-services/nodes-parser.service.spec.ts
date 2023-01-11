import { TestBed } from '@angular/core/testing';
import { NodeTypeName } from '@app/types/nodes.type';

import { NodesParserService } from './nodes-parser.service';

describe('NodesParserService', () => {
  let service: NodesParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodesParserService);
  });

  describe('can check for unsupported nodes', () => {
    it('should return true if all node types are supported by parser', () => {
      const nodes = [
        { IONode: { nodeName: '157' } },
        { EndNode: { nodeName: '159' } },
      ];

      expect(() => {
        //@ts-ignore
        service.validate(nodes);
      }).not.toThrowError();
    });

    it('should throw error when on node is unsupported by parser', () => {
      const nodes = [
        { IONode: { nodeName: '157' } },
        { SomeUnsupportedNode: { nodeName: '159' } },
      ];

      expect(() => {
        //@ts-ignore
        service.validate(nodes);
      }).toThrowError(
        'The following Node types are not supported: SomeUnsupportedNode'
      );
    });

    it('should throw error when empty or null node list is passed', () => {
      expect(() => {
        //@ts-ignore
        service.validate([]);
      }).toThrowError('Questionnaire Node list was empty.');

      expect(() => {
        //@ts-ignore
        service.validate(null);
      }).toThrowError('Questionnaire Node list was empty.');
    });
  });
});
