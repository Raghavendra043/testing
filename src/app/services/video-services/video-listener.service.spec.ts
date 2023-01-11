import { HttpClient } from '@angular/common/http';
import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppConfig, OIDCConfig } from '@app/types/config.type';
import { EventType, StatusEvent, StatusType } from '@app/types/listener.type';
import { NativeService } from '../native-services/native.service';
import { VideoListenerService } from './video-listener.service';

describe('VideoListenerService', () => {
  let service: VideoListenerService;
  let native: NativeService;
  // let httpClient: HttpClient;
  // let httpTestingController: HttpTestingController;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const url = 'http://www.example.com';
  const pendingMeasurement = {
    message: {
      body: {
        type: 'device_request',
        meter: 'BLOOD_PRESSURE_MONITOR',
      },
    },
  };

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
    await TestBed.compileComponents();
    const router = TestBed.inject(Router);
    // router.initialNavigation();
  });

  beforeEach(() => {
    service = TestBed.inject(VideoListenerService);
    native = TestBed.inject(NativeService);
  });

  // afterEach(() => {
  //   httpTestingController.verify();
  // });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should parse conference started event', fakeAsync(() => {
    // TODO: Find out how to make theste tests pass. This is however still tested manually.
    const conferenceStartedEvent: StatusEvent = {
      type: EventType.STATUS,
      status: {
        type: StatusType.INFO,
        message: 'CONFERENCE_STARTED',
      },
    };
    const model = { state: 'joining' };

    service.listenForNativeEvent(url, model);

    native.sendMessageToNative({
      messageType: service.constants.videoConferenceResponse,
      event: conferenceStartedEvent,
    });

    flush();

    expect(model.state).toEqual('joined');
  }));

  // it("should parse conference ended event", inject(($timeout) => { // TODO: make this test pass later
  //   const conferenceEndedEvent = {
  //     timestamp: "2015-05-11T12:33:13.000+02:00",
  //     type: "status",
  //     status: {
  //       type: "info",
  //       message: "CONFERENCE_ENDED",
  //     },
  //   };
  //   const model = {};

  //   videoListener.listenForNativeEvent(url, model);

  //   nativeEventCallback({
  //     messageType: "videoConferenceResponse",
  //     event: conferenceEndedEvent,
  //   });

  //   $timeout.flush();
  //   expect(location.path()).toEqual("/menu");
  // }));

  // it("should parse conference error event", inject(($timeout) => { // TODO: make this test pass later
  //   const conferenceErrorEvent = {
  //     timestamp: "2015-05-11T12:33:13.000+02:00",
  //     type: "status",
  //     status: {
  //       type: "error",
  //       message: "CONFERENCE_ERROR",
  //     },
  //   };
  //   const model = {};

  //   videoListener.listenForNativeEvent(url, model);

  //   nativeEventCallback({
  //     messageType: "videoConferenceResponse",
  //     event: conferenceErrorEvent,
  //   });

  //   $timeout.flush();
  //   expect(location.path()).toEqual("/menu");
  // }));
});
