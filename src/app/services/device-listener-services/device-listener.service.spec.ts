import { TestBed } from "@angular/core/testing";
import { meterTypes } from "@app/types/meter.type";
import { StatusType } from "@app/types/listener.type";

import { DeviceListenerService } from "./device-listener.service";

describe("DeviceListenerService", () => {
  let service: DeviceListenerService;

  const handleEvent = (event: any) => {
    let model = {};
    //@ts-ignore
    const eventListener = service.create(model, meterTypes.THERMOMETER);
    eventListener(event);
    return model;
  };

  beforeEach(() => {
    //TODO: Find out how to make this test pass. This is however still tested manually.
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceListenerService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  xit("should parse connecting event", () => {
    // TODO: Fix later
    const connectingEvent = {
      timestamp: "2015-06-12T14:21:13.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTING",
      },
    };

    const model: any = handleEvent(connectingEvent);
    expect(model.info).toEqual("CONNECTING");
  });

  xit("should parse connected event", () => {
    // TODO: Fix later
    const connectedEvent = {
      timestamp: "2015-06-12T17:33:14.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTED",
      },
    };

    const model: any = handleEvent(connectedEvent);

    expect(model.info).toEqual("CONNECTED");
  });

  xit("should parse error event", () => {
    // TODO: Fix later
    const errorEvent = {
      timestamp: "2015-06-13T03:12:54.000+02:00",
      type: "status",
      status: {
        type: "error",
        message: "TEMPORARY_PROBLEM",
      },
    };

    const model: any = handleEvent(errorEvent);

    expect(model.error).toEqual("TEMPORARY_PROBLEM");
  });

  xit("should invoke passed measurement event handler", () => {
    // TODO: Fix later
    const event = {
      timestamp: "2015-05-11T12:33:07.000+02:00",
      type: "measurement",
      measurement: {
        type: "temperature",
        unit: "C",
        value: 37.3,
      },
    };

    const model: any = handleEvent(event);
    expect(model.temperature).toEqual(37.3);
  });

  xit("should be possible to override status event handlers", () => {
    // TODO: Fix later
    const event = {
      timestamp: "2015-06-12T17:33:14.000+02:00",
      type: "status",
      status: {
        type: "info",
        message: "CONNECTED",
      },
    };

    let actualEvent;

    service.overrideStatusEventHandler(
      StatusType.INFO,
      (model: any, passedEvent: any) => {
        actualEvent = passedEvent;
      }
    );

    handleEvent(event);

    expect(actualEvent).toBeDefined();
    //@ts-ignore
    expect(actualEvent).toEqual(event.status);
  });
});
