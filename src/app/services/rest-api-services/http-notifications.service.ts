import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HttpNotificationsService {
  onRequestStartedListeners: any = [];
  onRequestEndedListeners: any = [];
  count = 0;

  private httpLoading = new ReplaySubject<boolean>(1);

  httpProgress(): Observable<boolean> {
    return this.httpLoading.asObservable();
  }

  setHttpProgressStatus(inprogess: boolean) {
    this.httpLoading.next(inprogess);
  }

  constructor() {}

  increment() {
    this.count++;
  }
  decrement() {
    if (this.count > 0) this.count--;
  }

  getCount() {
    return this.count;
  }

  subscribeOnRequestStarted = (listener: any) => {
    this.onRequestStartedListeners.push(listener);
  };

  fireRequestStarted = (request: any) => {
    this.increment();

    this.onRequestStartedListeners.forEach((listener: any) => {
      listener(request);
    });

    return request;
  };

  subscribeOnRequestEnded = (listener: any) => {
    this.onRequestEndedListeners.push(listener);
  };

  fireRequestEnded = (response: any): any => {
    this.decrement();
    this.onRequestEndedListeners.forEach((listener: any) => {
      listener(response);
    });

    return response;
  };
  getRequestCount() {
    return this.getCount();
  }
}
