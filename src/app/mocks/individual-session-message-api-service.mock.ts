import { Injectable } from '@angular/core';

Injectable();
export class FakeIndividualSessionMessageApiService {
  pendingMeasurement: any;

  constructor(pendingMeasurement: any) {
    this.pendingMeasurement = pendingMeasurement;
  }

  pollForSessionMessages(_url: any) {
    return Promise.resolve({ data: this.pendingMeasurement });
  }
  sendSessionMessage(_url: any, responseMessage: any) {
    // measurementPayload = responseMessage;

    const fakePromise = {
      then: (fun: any) => {
        fun();
        return { catch: (_fun: any): any => undefined };
      },
    };

    return fakePromise;
  }
}
