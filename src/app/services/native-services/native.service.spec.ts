import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NativeService } from './native.service';

describe('NativeService', () => {
  let service: NativeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NativeService);
  });

  beforeEach(() => {
    const sendMessageToNative = (raw: any) => {
      const message = JSON.parse(raw);

      switch (message.messageType) {
        case 'videoEnabledRequest':
          service.publishMessageFromNative({
            messageType: 'videoEnabledResponse',
            enabled: true,
          });
          break;

        case 'deviceTokenRequest':
          service.publishMessageFromNative({
            messageType: 'deviceTokenResponse',
            deviceToken: '95ed621c-ed42-4e70-9c7b-8f9ab9f65574',
          });
          break;
      }
    };

    // @ts-ignore
    globalThis = {
      external: {
        notify: sendMessageToNative,
      },
      open: (url: string) => {},
    };
  });

  describe('can publish and subscribe to messages from native layer', () => {
    it('should be possible to subscribe to message', fakeAsync(() => {
      let messageFromNative;

      service.subscribeToSingleMessage('testmessage', (message: any) => {
        messageFromNative = message;
      });

      service.publishMessageFromNative({
        //@ts-ignore
        messageType: 'testmessage',
        someProp: true,
      });
      tick();

      expect(messageFromNative).toBeDefined();

      expect(messageFromNative).toEqual({
        //@ts-ignore
        messageType: 'testmessage',
        someProp: true,
      });
    }));

    it('should cancel single message subscription when message has been published', fakeAsync(() => {
      let callbackInvoked = false;
      service.subscribeToSingleMessage('testmessage', (_message: any) => {
        callbackInvoked = true;
      });

      service.publishMessageFromNative({
        //@ts-ignore
        messageType: 'testmessage',
        someProp: true,
      });
      tick();
      expect(callbackInvoked).toBeTruthy();
      callbackInvoked = false;

      service.publishMessageFromNative({
        //@ts-ignore
        messageType: 'testmessage',
        someProp: true,
      });
      tick();
      expect(callbackInvoked).toBeFalsy();
    }));

    it('should be possible to have multiple different subscribers of message', fakeAsync(() => {
      let callbackCount = 0;

      service.subscribeToSingleMessage('testmessage', (_message: any) => {
        // Each callback must contain different code otherwise they will be considered to be the same callback registered twice
        const foo = 'bar';
        callbackCount++;
      });

      service.subscribeToSingleMessage('testmessage', (_message: any) => {
        const bar = 'foo';
        callbackCount++;
      });

      service.publishMessageFromNative({
        //@ts-ignore
        messageType: 'testmessage',
        someProp: true,
      });
      tick();

      expect(callbackCount).toBe(2);
    }));

    it('only one message subscription exist if trying to subscribe to same message with same callback twice', fakeAsync(() => {
      let callbackCount = 0;

      const callback = (_message: any) => {
        callbackCount++;
      };

      service.subscribeToSingleMessage('testmessage', callback);
      service.subscribeToSingleMessage('testmessage', callback);

      service.publishMessageFromNative({
        //@ts-ignore
        messageType: 'testmessage',
        someProp: true,
      });
      tick();

      expect(callbackCount).toBe(1);
    }));

    it('should be possible to subscribe to continous messages of same type', fakeAsync(() => {
      let messageReceivedCount = 0;

      service.subscribeToMultipleMessages('testmessage', (_message: any) => {
        messageReceivedCount++;
      });

      service.publishMessageFromNative({
        //@ts-ignore
        messageType: 'testmessage',
        someProp: true,
      });

      service.publishMessageFromNative({
        //@ts-ignore
        messageType: 'testmessage',
        someProp: true,
      });
      tick();

      expect(messageReceivedCount).toBe(2);
    }));

    it('should be possible to unsubscribe single subscriber from message type', fakeAsync(() => {
      let firstHandlerCalled = false;
      let secondHandlerCalled = false;

      service.subscribeToMultipleMessages('testmessage', (_message: any) => {
        firstHandlerCalled = true;
      });

      const callback = (_message: any) => {
        secondHandlerCalled = true;
      };
      service.subscribeToMultipleMessages('testmessage', callback);

      service.unsubscribe('testmessage', callback);
      service.publishMessageFromNative({
        //@ts-ignore
        messageType: 'testmessage',
        someProp: true,
      });
      tick();
      expect(firstHandlerCalled).toBeTruthy();
      expect(secondHandlerCalled).toBeFalsy();
    }));

    it('should be possible to unsubscribe all subscribers from specific message type', fakeAsync(() => {
      let firstHandlerCalled = false;
      let secondHandlerCalled = false;

      service.subscribeToMultipleMessages('testmessage', (_message: any) => {
        firstHandlerCalled = true;
      });

      service.subscribeToMultipleMessages('testmessage', (_message: any) => {
        secondHandlerCalled = true;
      });

      service.unsubscribeAll('testmessage');
      service.publishMessageFromNative({
        //@ts-ignore
        messageType: 'testmessage',
        someProp: true,
      });
      tick();

      expect(firstHandlerCalled).toBeFalsy();
      expect(secondHandlerCalled).toBeFalsy();
    }));
  });

  describe('when there exists a native layer', () => {
    it('should forward open url requests to native layer', () => {
      // @ts-ignore
      spyOn(globalThis.external, 'notify');

      const url = 'http://www.google.dk';
      service.openUrl(url);
      // @ts-ignore
      expect(globalThis.external.notify).toHaveBeenCalledWith(
        JSON.stringify({ messageType: 'openUrlRequest', url: url })
      );
    });

    // Notifications

    it('should send get device token as expected', () => {
      let deviceToken = 'not-set';

      service.getDeviceToken((response: any) => {
        deviceToken = response.deviceToken;
      });

      expect(deviceToken).toEqual('95ed621c-ed42-4e70-9c7b-8f9ab9f65574');
    });

    it('should send questionnaire id as expected', () => {
      // @ts-ignore
      spyOn(globalThis.external, 'notify');

      const questionnaireId = 42;
      service.clearScheduledQuestionnaire(questionnaireId);
      // @ts-ignore
      expect(globalThis.external.notify).toHaveBeenCalledWith(
        JSON.stringify({
          messageType: 'clearScheduledQuestionnaireRequest',
          questionnaireId: 42,
        })
      );
    });

    it('should send request to clear unread messages as expected', () => {
      // @ts-ignore
      spyOn(globalThis.external, 'notify');

      service.clearUnreadMessages();
      // @ts-ignore
      expect(globalThis.external.notify).toHaveBeenCalledWith(
        JSON.stringify({
          messageType: 'clearUnreadMessagesRequest',
        })
      );
    });

    // Video
    it('should forward start notification sound requests to native layer', () => {
      // @ts-ignore
      spyOn(globalThis.external, 'notify');

      service.playNotificationSound();
      // @ts-ignore
      expect(globalThis.external.notify).toHaveBeenCalledWith(
        JSON.stringify({ messageType: 'startNotificationSoundRequest' })
      );
    });

    it('should forward stop notification sound requests to native layer', () => {
      // @ts-ignore
      spyOn(globalThis.external, 'notify');

      service.stopNotificationSound();
      // @ts-ignore
      expect(globalThis.external.notify).toHaveBeenCalledWith(
        JSON.stringify({ messageType: 'stopNotificationSoundRequest' })
      );
    });

    it('should return a boolean when checking if client is video enabled', fakeAsync(() => {
      let clientIsVideoEnabled = false;

      service.clientIsVideoEnabled((response: any) => {
        clientIsVideoEnabled = response.enabled;
      });
      tick();

      expect(clientIsVideoEnabled).toEqual(true);
    }));

    it('should correctly pass argument to joinConference method', () => {
      // @ts-ignore
      spyOn(globalThis.external, 'notify');

      const videoConference = {
        isOneOnOne: true,
        videoType: 'vidyo',
        parameters: {
          username: 'NancyAnn',
          resourceId: 'hngkjjhds83yuhaeioyh',
          token: 'ojhoivbjhdvfier342p8rwafuyeo98yf',
          host: 'prod.vidyo.io',
        },
      };
      service.joinConference(videoConference);
      // @ts-ignore
      expect(globalThis.external.notify).toHaveBeenCalledWith(
        JSON.stringify({
          messageType: 'startVideoConferenceRequest',
          videoConference: videoConference,
        })
      );
    });

    // Device listeners

    it('should send correct message to native layer when addDeviceListener is called', () => {
      //@ts-ignore
      spyOn(globalThis.external, 'notify');

      const meterType = 'blood pressure monitor';
      //@ts-ignore
      service.addDeviceListener(meterType);
      //@ts-ignore
      expect(globalThis.external.notify).toHaveBeenCalledWith(
        JSON.stringify({
          messageType: 'deviceMeasurementRequest',
          meterType: meterType,
        })
      );
    });

    it('should send correct message to native layer when removeDeviceListeners is called', () => {
      //@ts-ignore
      spyOn(globalThis.external, 'notify');
      service.removeDeviceListeners();
      //@ts-ignore
      expect(globalThis.external.notify).toHaveBeenCalledWith(
        JSON.stringify({ messageType: 'stopDeviceMeasurementRequest' })
      );
    });

    it('should unsubscribe to measurement response messages from native layer when removeDeviceListeners is called', () => {
      let subscriptionNotCancelled = false;

      service.subscribeToMultipleMessages('deviceMeasurementResponse', () => {
        subscriptionNotCancelled = true;
      });

      service.removeDeviceListeners();
      //@ts-ignore
      service.publishMessageFromNative({
        messageType: 'deviceMeasurementResponse',
      });

      expect(subscriptionNotCancelled).toBeFalsy();
    });
  });

  describe('when no native layer exists', () => {
    beforeEach(() => {
      // @ts-ignore
      globalThis = {
        open: (url: string) => {},
      };
    });

    it('@Requirement As a citizen, I want to be able to open Information and guidance links when logged in to the citizen client in a browser', fakeAsync(() => {
      spyOn(globalThis, 'open');

      const url = 'http://www.google.dk';
      service.openUrl(url);
    }));

    it('should return proper defaults', () => {
      expect(() => {
        service.getDeviceToken(() => {});
      }).not.toThrow();

      expect(() => {
        service.clearScheduledQuestionnaire(1);
      }).not.toThrow();

      expect(() => {
        service.clearUnreadMessages();
      }).not.toThrow();

      expect(() => {
        service.clientIsVideoEnabled(() => {});
      }).not.toThrow();

      expect(() => {
        service.joinConference({});
      }).not.toThrow();

      const result = service.addDeviceListener('saturation', () => {});
      expect(result).toEqual(false);

      service.removeDeviceListeners();
    });
  });
});
