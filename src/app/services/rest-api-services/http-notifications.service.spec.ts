import { TestBed } from '@angular/core/testing';
import { HttpNotificationsService } from './http-notifications.service';

describe('HttpNotificationsService', () => {
  let service: HttpNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(HttpNotificationsService);
  });

  it('should be possible to be notified about http request start', () => {
    let notificationData = {};
    service.subscribeOnRequestStarted((request: any) => {
      notificationData = request;
    });

    service.fireRequestStarted({
      data: true,
    });

    expect(notificationData).toEqual({
      data: true,
    });
  });

  it('should be possible to be notified about http request end', () => {
    let notificationData = {};
    service.subscribeOnRequestEnded((request: any) => {
      notificationData = request;
    });

    service.fireRequestEnded({
      data: true,
    });

    expect(notificationData).toEqual({
      data: true,
    });
  });

  it('should be able to get count of outstanding requests', () => {
    service.fireRequestStarted({});
    service.fireRequestStarted({});
    service.fireRequestStarted({});
    expect(service.getRequestCount()).toBe(3);

    service.fireRequestEnded({});
    service.fireRequestEnded({});
    expect(service.getRequestCount()).toBe(1);

    service.fireRequestEnded({});
    expect(service.getRequestCount()).toBe(0);
  });
});
