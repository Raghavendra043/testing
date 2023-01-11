import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared/shared.module';
import { HeaderModule } from '@components/header/header.module';
import { LoadingModule } from '@components/loading/loading.module';
import { TranslateModule } from '@ngx-translate/core';
import { NativeService } from '@services/native-services/native.service';
import { NodesParserService } from '@services/parser-services/nodes-parser.service';
import { QuestionnairesService } from '@services/rest-api-services/questionnaires.service';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { Utils } from '@services/util-services/util.service';
import { MomentModule } from 'ngx-moment';
import { Location } from '@angular/common';
import { QuestionnaireComponent } from './questionnaire.component';
import { FakeQuestionnairesService } from '@app/mocks/rest-service.mock';
import { ParserUtilsService } from '@services/parser-services/parser-utils.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { identifierName } from '@angular/compiler';
import { MenuComponent } from '@components/menu/menu/menu.component';
import { HttpBackend } from '@angular/common/http';
import { QuestionnairesComponent } from '../questionnaires/questionnaires.component';
import { HeaderComponent } from '@components/header/header/header.component';

const restResponse = {
  name: 'Blodsukker (manuel)',
  id: 27,
  startNode: '157',
  endNode: '159',
  nodes: [
    {
      IONode: {
        nodeName: '157',
        elements: [
          {
            TextViewElement: {
              text: 'Time to measure blood sugar!',
            },
          },
          {
            ButtonElement: {
              text: 'Næste',
              gravity: 'center',
              next: '158',
            },
          },
        ],
      },
    },
    {
      BloodSugarManualDeviceNode: {
        nodeName: '158',
        next: 'ANSEV_159_D158',
        nextFail: 'AN_158_CANCEL',
        text: 'Blodsukker',
        bloodSugarMeasurements: {
          name: '158.BS#BLOODSUGARMEASUREMENTS',
          type: 'Object',
        },
        deviceId: {
          name: '158.BS#DEVICE_ID',
          type: 'String',
        },
      },
    },
    {
      EndNode: {
        nodeName: '159',
      },
    },
  ],
  output: [],
};

describe('QuestionnaireComponent', () => {
  let component: QuestionnaireComponent;
  let fixture: ComponentFixture<QuestionnaireComponent>;
  let router: Router;
  let location: Location;
  let appContext: StatePassingService;
  let utils: Utils;
  let questionnaires: QuestionnairesService;
  let header: HeaderComponent;
  let native: NativeService;
  let parserUtils: ParserUtilsService;
  let nodesParserService: NodesParserService;

  function init(fn?: any) {
    // @ts-ignore
    globalThis = {
      history: {
        back: () => {},
      },
    };

    appContext = new StatePassingService(router);
    utils = new Utils();
    native = new NativeService();
    parserUtils = new ParserUtilsService();
    nodesParserService = new NodesParserService(parserUtils, native);
    //   questionnaires = new FakeQuestionnairesService(restResponse)
    TestBed.configureTestingModule({
      declarations: [QuestionnaireComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        HeaderModule,
        LoadingModule,
        SharedModule,
        MomentModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'questionnaires',
            component: QuestionnairesComponent,
          },
          {
            path: 'questionnaires/:id/questionnaire',
            component: QuestionnaireComponent,
          },
          {
            path: 'menu',
            component: MenuComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: StatePassingService,
          useValue: appContext,
        },
        {
          provide: Utils,
          useValue: utils,
        },
        {
          provide: QuestionnairesService,
          useValue: new FakeQuestionnairesService(restResponse),
        },
        {
          provide: NativeService,
          useValue: new NativeService(),
        },
        {
          provide: NodesParserService,
          useValue: nodesParserService,
        },
      ],
    });

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    native = TestBed.inject(NativeService);
    appContext = TestBed.inject(StatePassingService);
    appContext.requestParams.set('selectedQuestionnaire', {
      links: {
        questionnaire: 'http://localhost/questionnaire/1',
      },
    });
    if (fn) {
      fn();
    }
    fixture = TestBed.createComponent(QuestionnaireComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  }

  describe('preconditions', () => {
    const initFn = () => {
      appContext.requestParams.getAndClear('selectedQuestionnaire'); // clear it...
    };
    beforeEach(() => {
      init(initFn);
    });

    it('should redirect back to menu page if no questionnaire has been selected', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(location.path()).toBe('/menu');
    });
  });

  describe('Menu button', () => {
    beforeEach(() => {
      init();
    });

    it('should remove device listeners when pressing menu click at a node', async () => {
      spyOn(native, 'removeDeviceListeners');
      fixture.detectChanges();
      await fixture.whenStable();
      component.goBack();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(native.removeDeviceListeners).toHaveBeenCalled();
    });
  });

  describe('Back button', () => {
    beforeEach(() => {
      init();
    });
    it('should have a nodeHistory', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.nodeHistory).toBeDefined();
    });

    it('nodeHistory should have length one', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.nodeHistory.length).toEqual(1);
    });

    it('nodeHistory should have entry 157', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.nodeHistory[0]).toEqual('157');
    });

    it('should navigate to /questionnaires when pressing back click at first node', async () => {
      //@ts-ignore
      globalThis = {
        history: {
          back: () => {
            router.navigate(['/questionnaires']);
          },
        },
      };

      const navigateSpy = spyOn(router, 'navigate');
      await fixture.whenStable();
      fixture.detectChanges();
      spyOn(native, 'removeDeviceListeners');

      component.goBack();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledWith(['/questionnaires']);
      expect(native.removeDeviceListeners).toHaveBeenCalled();
    });

    xit('should push a new node on history when pressing next', async () => {
      // TODO: Make this test able to pass

      await fixture.whenStable();
      fixture.detectChanges();
      component.model.centerButton = {
        click: () => {
          component.outputModel = {
            '2410.HEIGHT': { name: '2410.HEIGHT', type: 'Integer', value: 180 },
          };
        },
        validate: (scope) => true,
        show: true,
        text: 'Next',
      };
      //@ts-ignore
      component.model.centerButton.click();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(component.nodeHistory.length).toEqual(2);
    });

    xit('should try to remove any device listeners when pressing a button', async () => {
      // TODO: Make this test able to pass

      spyOn(native, 'removeDeviceListeners');
      fixture.detectChanges();
      await fixture.whenStable();
      component.model.centerButton = {
        click: () => {},
        validate: (scope) => true,
        show: true,
        text: 'Next',
      };
      //@ts-ignore
      component.model.centerButton.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(native.removeDeviceListeners).toHaveBeenCalled();
    });

    xit('next node should be 158', async () => {
      // TODO: Make this test able to pass
      fixture.detectChanges();
      await fixture.whenStable();
      //@ts-ignore
      component.model.centerButton.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.nodeHistory[1]).toEqual('158');
    });

    xit('should navigate to node 157 when pressing back click at node 1588', async () => {
      // TODO: Make this test able to pass
      fixture.detectChanges();
      await fixture.whenStable();
      //@ts-ignore
      component.model.centerButton.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.nodeHistory[1]).toEqual('158');
      globalThis.history.back(); //   scope.$parent.$broadcast('backClick');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.nodeHistory[0]).toEqual('157');
    });
  });

  describe('GUI side effects', () => {
    beforeEach(() => {
      init();
    });
    it('should have hidden left button', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.model.leftButton.show).toEqual(false);
    });

    it('should have visible center button', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.model.centerButton.show).toEqual(true);
    });

    it('should have hidden right button', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.model.rightButton.show).toEqual(false);
    });
  });

  // describe("invoke click actions", () => { // TODO: Fix later
  //   beforeEach(() => {
  //     init();
  //   });

  //   it("should call clickAction when pressing Next", () => {
  //     let clicked = false;

  //     nodesParser.parse = () => {
  //       const representation = {
  //         html: "",
  //         nodeModel: {},
  //         centerButton: {
  //           text: "Next",
  //           nextNodeId: "159",
  //           clickAction: () => {
  //             clicked = true;
  //           },
  //         },
  //       };

  //       return representation;
  //     };

  //     ctrl.model.centerButtonClick(); // extra click -> first clickButton already created before mocking parse
  //     ctrl.model.centerButtonClick();
  //     expect(clicked).toEqual(true);
  //   });
  // });

  // describe("collect and send output", () => { // TODO: fix later
  //   beforeEach(() => {
  //     init();
  //   });

  //   beforeEach(() => {
  //     nodesParser.parse = (
  //       _currentNodeId: any,
  //       _nodeMap: any,
  //       outputModel: any
  //     ) => {
  //       const representation = {
  //         isEndNode: true,
  //         nodeModel: {},
  //       };

  //       outputModel.TEST_OUTPUT = {
  //         name: "test name",
  //         value: 1234,
  //       };

  //       return representation;
  //     };

  //     ctrl.model.centerButtonClick(); // extra click -> first clickButton already created before mocking parse method
  //   });

  //   it("should redirect to send reply page when end node is reached", () => {
  //     ctrl.model.rightButtonClick();

  //     expect(location.path()).toMatch(/\/send_reply/);
  //   });

  //   it("should transfer state to send reply page when end node is reached", () => {
  //     ctrl.model.rightButtonClick();

  //     expect(
  //       appContext.requestParams.containsKey("questionnaireState")
  //     ).toBeTruthy();

  //     const state = appContext.requestParams.getAndClear(
  //       "questionnaireState"
  //     );

  //     expect(state.outputs).toBeDefined();
  //     expect(state.questionnaire).toBeDefined();
  //     expect(state.questionnaireRef).toBeDefined();
  //     expect(state.nodeHistory).toBeDefined();
  //   });

  //   it("should collect output when end node is reached", () => {
  //     ctrl.model.rightButtonClick();

  //     const state = appContext.requestParams.getAndClear(
  //       "questionnaireState"
  //     );

  //     expect(state.outputs).not.toBe(null);
  //     expect(state.outputs.length).toBe(1);
  //     expect(state.outputs[0].name).toBe("test name");
  //     expect(state.outputs[0].value).toBe(1234);
  //   });
  // });
});
