import { Injectable } from '@angular/core';

Injectable();
export class FakeClientLoggingService {
  enable = (logUrl: string): void => {
    console.log('FakeClientLoggingService.enabled was called');
  };
}
