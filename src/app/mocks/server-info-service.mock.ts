import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';

Injectable();
export class FakeServerInfoService {
  shouldReject = false;
  get() {
    if (this.shouldReject) {
      return throwError(() => void 0);
    } else {
      return of({
        links: {
          auth: 'http://example.org/some/url',
        },
      });
    }
  }
}
