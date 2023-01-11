import { Injectable } from '@angular/core';

Injectable();
export class FakeVideoService {
  individualSessionToken: any;
  constructor(individualSessionToken?: any) {
    this.individualSessionToken = individualSessionToken;
  }

  listenForNativeEvent = (individualSessionUrl: string, model: any) => {
    return (event: any) => {};
  };
  isHostPresent = (individualSessionUrl: string) => {
    return Promise.resolve(this.individualSessionToken);
  };
  sessionEnded(individualSessionUrl: string) {}

  checkForSessionAndJoin() {
    return Promise.resolve();
  }
}
