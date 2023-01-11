// import { ApplicationRef } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { AppComponent } from '@app/app.component';
// import { FakeConfigService } from '@app/mocks/config-service.mock';
// import { SharedModule } from '@app/shared/shared.module';
// import { AppConfig } from '@app/types/config.type';
// import { Message } from '@app/types/messages.type';
// import { meterTypes } from '@app/types/meter.type';
// import { NodeTypeName } from '@app/types/nodes.type';
// import { NodeRepresentation } from '@app/types/parser.type';
// import { HeaderModule } from '@components/header/header.module';
// import { NotificationsModule } from '@components/notifications/notifications.module';
// import { TranslateModule } from '@ngx-translate/core';
// import { DeviceListenerService } from '@services/device-listener-services/device-listener.service';
// import { FakeNativeLayerService } from '@services/native-services/fake-native-layer.service';
// import { NativeService } from '@services/native-services/native.service';
// import { DeviceNodeParserService } from '@services/parser-services/device-node-parser.service';
// import { ParserUtilsService } from '@services/parser-services/parser-utils.service';
// import { ConfigService } from '@services/state-services/config.service';

// import { AutomaticDeviceNodeComponent } from './automatic-device-node.component';

// // class FakeNativeService extends NativeService {
// //   private override removeSecretFields = (message: any) => {
// //     const clone = JSON.parse(JSON.stringify(message));
// //     delete clone.credentials;
// //     return clone;
// //   };

// //   override sendMessageToNative = (request: any) => {
// //     const msgAsString = JSON.stringify(request);
// //     const messageToLog = this.removeSecretFields(request);

// //     console.debug(
// //       'Sending message to native layer: ' + JSON.stringify(messageToLog)
// //     );
// //     return true;
// //   };
// // }

// class FakeNativeLayerMock extends FakeNativeLayerService {
//   override addDeviceListener = () => {};
// }

// describe('AutomaticDeviceNodeComponent: ', () => { //TODO: Consider adding automatic device node component tests from the old Angular project later on. These are however still tested manually.
//   // TODO: Find out how to make this fixture pass
//   let component: AutomaticDeviceNodeComponent;
//   let fixture: ComponentFixture<AutomaticDeviceNodeComponent>;
//   let native: NativeService;
//   let parserUtils: ParserUtilsService;
//   let deviceListener: DeviceListenerService;
//   let deviceNodeParser: DeviceNodeParserService;
//   let applicationRef: ApplicationRef;
//   let config: any;
//   let fakeNative: any;
//   async function init(
//     node: any,
//     nodeMap: any,
//     meterTypeName: string,
//     nodeTypeName: string
//   ): Promise<NodeRepresentation> {
//     // @ts-ignore
//     globalThis = {
//       sendMessageToWebView: () => {},
//       //   external: { notify: (message: string) => {} },
//     };
//     config = new FakeConfigService();

//     native = new NativeService();
//     // fakeNative = ;
//     parserUtils = new ParserUtilsService();
//     deviceListener = new DeviceListenerService();
//     deviceNodeParser = new DeviceNodeParserService(
//       parserUtils,
//       native,
//       deviceListener
//     );
//     console.log('AUTOMATIC DEVICE COMPONENT TEST BEFORE TESTBED');
//     await TestBed.configureTestingModule({
//       declarations: [AutomaticDeviceNodeComponent, AppComponent],
//       providers: [
//         { provide: ConfigService, useValue: config },
//         { provide: NativeService, useValue: native },
//         { provide: ParserUtilsService, useValue: parserUtils },
//         { provide: DeviceListenerService, useValue: deviceListener },
//         { provide: DeviceNodeParserService, useValue: deviceNodeParser },
//         {
//           provide: FakeNativeLayerService,
//           // useValue: new FakeNativeLayerMock(config), //

//           useValue: new FakeNativeLayerService(config),
//         },

//         ApplicationRef,
//       ],
//       imports: [
//         ReactiveFormsModule,
//         SharedModule,
//         HeaderModule,
//         NotificationsModule,
//         TranslateModule.forRoot(),
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(AutomaticDeviceNodeComponent);

//     component = fixture.componentInstance;
//     component.node = node;
//     component.nodeMap = nodeMap; //{ '146': { type: node } };

//     //@ts-ignore
//     component.scope = { hasOffendingValue: () => false };
//     component.parameters = {
//       meterTypeName: meterTypeName,
//       nodeTypeName: nodeTypeName,
//     };
//     native = TestBed.inject(NativeService);
//     applicationRef = TestBed.inject(ApplicationRef);
//     config = TestBed.inject(ConfigService);
//     console.log('config:');
//     console.log(config.getAppConfig());
//     await fixture.whenStable();
//     fixture.detectChanges();
//     expect(component).toBeTruthy();
//     //@ts-ignore
//     const representation: NodeRepresentation = component.getRepresentation();
//     return representation;
//   }

//   //   it('should create', () => {
//   //     expect(component).toBeTruthy();
//   //   });

//   describe('ActivityDeviceNode', () => {
//     const origin = {
//       device_measurement: {
//         connection_type: 'USB',
//         manufacturer: 'ACME Inc',
//         firmware_version: '5-t',
//         model: 'ABC-1234',
//         primary_device_identifier: {
//           serial_number: '1234-555',
//         },
//         additional_device_identifiers: [
//           {
//             other: {
//               description: 'eui_64',
//               value: '1234567890',
//             },
//           },
//         ],
//       },
//     };

//     it('should parse daily steps measurement event', async () => {
//       const activityEvent2 = {
//         timestamp: '2015-05-11T12:33:07.000+02:00',
//         origin: origin,
//         type: 'measurement',
//         messageType: 'deviceMeasurementResponse',
//         meterType: meterTypes.ACTIVITY_TRACKER,
//         measurement: {
//           type: 'dailySteps',
//           unit: 'step count',
//           value: 9542,
//         },
//       };

//       const activityEvent = {
//         messageType: 'deviceMeasurementResponse',
//         meterType: 'activity tracker',
//         event: {
//           timestamp: '2019-05-27T11:55:58+02:00',
//           origin: {
//             device_measurement: {
//               connection_type: 'USB',
//               manufacturer: 'ACME Inc',
//               firmware_version: '5-t',
//               model: 'ABC-1234',
//               primary_device_identifier: {
//                 serial_number: '1234-555',
//               },
//               additional_device_identifiers: [
//                 {
//                   other: {
//                     description: 'eui_64',
//                     value: '1234567890',
//                   },
//                 },
//               ],
//             },
//           },
//           type: 'measurement',
//           measurement: {
//             type: 'dailySteps',
//             unit: 'step count',
//             value: 9654,
//           },
//         },
//       };

//       const node = {
//         nodeName: '146',
//         text: 'Dit daglige antal skridt',
//         next: 'ANSEV_147_D146',
//         nextFail: 'AN_146_CANCEL',
//         dailySteps: {
//           name: '146.ACTIVITY#DAILY_STEPS',
//           type: 'Integer',
//         },
//       };
//       const nodeMap = { '146': { ActivityManualDeviceNode: node } };

//       const model: any = {};
//       // const activityTracker = meterTypes.ACTIVITY_TRACKER;
//       // expect(activityTracker).toBeDefined();

//       // const eventListener = deviceListener.create(model, activityTracker);
//       const representation: NodeRepresentation = await init(
//         node,
//         nodeMap,
//         meterTypes.ACTIVITY_TRACKER.name,
//         NodeTypeName.ACTIVITY_DEVICE_NODE
//       );
//       await fixture.whenStable();
//       fixture.detectChanges();

//       //   eventListener(activityEvent);
//       // native.publishMessageFromNative({
//       //   messageType: 'deviceMeasurementRequest',
//       //   meterType: 'activity tracker',
//       //   parameters: {},
//       // });

//       //   native.publishMessageFromNative(activityEvent);
//       console.log('Sending message to webview');
//       //@ts-ignore
//       native.publishMessageFromNative(activityEvent);
//       //@ts-ignore
//       //   await globalThis.sendMessageToWebView(JSON.stringify(activityEvent2));

//       await fixture.whenStable();
//       fixture.detectChanges();

//       console.log(model.origin);
//       expect(model.origin).toEqual(origin);
//       expect(model.dailySteps).toEqual(9542);

//       //   setTimeout(function () {
//       //     console.log('Done waiting');
//       //     expect(model.dailySteps).toEqual(9542);
//       //   }, 5000);

//       // expect(model.origin).toEqual(origin);
//       // expect(model.dailySteps).toEqual(9542);
//     });
//   });
// });
