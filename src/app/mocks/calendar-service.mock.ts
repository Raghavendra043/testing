import { Injectable } from '@angular/core';

Injectable();
export class FakeCalendarService {
  response: unknown;
  constructor(response: unknown) {
    this.response = response;
  }

  async list(): Promise<unknown> {
    return this.response;
  }
}
