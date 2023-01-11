import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NativeService } from '@app/services/native-services/native.service';
import { Utils } from '../util-services/util.service';
import { NotificationsService } from './notifications.service';
import { HttpClient } from '@angular/common/http';
import { validUser } from '@app/mocks/user.mock';
import { User } from '@app/types/user.type';
import { of, throwError } from 'rxjs';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let utils: Utils;
  let native: NativeService;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
    await TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    utils = TestBed.inject(Utils);
    native = TestBed.inject(NativeService);
    service = new NotificationsService(native, utils, httpClientSpy);
  });

  it('should invoke error callback when status is 401', fakeAsync(() => {
    httpClientSpy.get.and.returnValue(of({}));
    let successCallbackInvoked = false;
    let errorCallbackInvoked = false;
    const onSuccess = () => (successCallbackInvoked = true);
    const onError = () => (errorCallbackInvoked = true);
    const user: User = {
      ...validUser,
    };

    service
      .registerDevice(user, 'some-device-token', 'Android')
      .then(onSuccess, onError);
    tick();
    expect(successCallbackInvoked).toBe(false);
    expect(errorCallbackInvoked).toBe(true);
  }));

  it('should invoke success callback when registering new device', fakeAsync(() => {
    let successCallbackInvoked = false;
    let errorCallbackInvoked = false;
    const onSuccess = () => (successCallbackInvoked = true);
    const onError = () => (errorCallbackInvoked = true);

    const user: User = {
      ...validUser,
      links: { ...validUser.links },
    };
    const expectedUrl = `${user.links.notifications}?patientUrl=${user.links.self}`;
    const emptySearchResponse: any = {
      links: {
        self: expectedUrl,
      },
      total: 0,
      offset: 0,
      max: 100,
      results: [],
    };

    httpClientSpy.get.and.callFake((url: any) => {
      if (url === expectedUrl) {
        return of(emptySearchResponse);
      } else {
        return throwError({ status: 400, data: {} });
      }
    });
    // @ts-ignore
    httpClientSpy.post.and.callFake((url: any, body: any, options: any) => {
      if (url === user.links.notifications) {
        return of({});
      } else {
        return throwError({ status: 400, data: {} });
      }
    });

    service
      .registerDevice(user, 'some-device-token', 'Android')
      .then(onSuccess, onError);
    tick();
    expect(successCallbackInvoked).toEqual(true);
    expect(errorCallbackInvoked).toEqual(false);
  }));

  it('should invoke success callback when updating a registered device', fakeAsync(() => {
    let successCallbackInvoked = false;
    let errorCallbackInvoked = false;
    const onSuccess = () => (successCallbackInvoked = true);
    const onError = () => (errorCallbackInvoked = true);
    const user: User = {
      ...validUser,
      links: { ...validUser.links },
    };
    const expectedUrl = `${user.links.notifications}?patientUrl=${user.links.self}`;

    const emptySearchResponse = {
      links: {
        self: expectedUrl,
      },
      total: 1,
      offset: 0,
      max: 100,
      results: [
        {
          patientUrl: user.links.self,
          deviceToken: 'some-device-token',
          deviceOS: 'Android',
          links: {
            device: user.links.notifications + '/2',
          },
        },
      ],
    };

    // @ts-ignore
    httpClientSpy.get.and.callFake((url: any) => {
      if (url === expectedUrl) {
        return of(emptySearchResponse);
      } else {
        return throwError({ status: 400, data: {} });
      }
    });

    // @ts-ignore
    httpClientSpy.put.and.callFake((url: any, body: any) => {
      if (url === user.links.notifications + '/2') {
        return of({});
      } else {
        return throwError({ status: 400, data: {} });
      }
    });

    service
      .registerDevice(user, 'some-new-device-token', 'Android')
      .then(onSuccess, onError);

    tick();
    expect(successCallbackInvoked).toEqual(true);
    expect(errorCallbackInvoked).toEqual(false);
  }));

  it('should call native service when trying to register device for push notifications', fakeAsync(() => {
    const user: User = {
      ...validUser,
      links: { ...validUser.links },
    };

    const expectedUrl = `${user.links.notifications}?patientUrl=${user.links.self}`;

    const emptySearchResponse: any = {
      links: {
        self: expectedUrl,
      },
      total: 0,
      offset: 0,
      max: 100,
      results: [],
    };

    httpClientSpy.get.and.callFake((url: any) => {
      if (url === expectedUrl) {
        return of(emptySearchResponse);
      } else {
        return throwError({ status: 400, data: {} });
      }
    });

    // @ts-ignore
    httpClientSpy.post.and.callFake((url: any, body: any) => {
      if (url === user.links.notifications) {
        return of({});
      } else {
        return throwError({ status: 400, data: {} });
      }
    });

    spyOn(native, 'getDeviceToken');

    service.registerDeviceForPushNotifications(user);
    tick();
    expect(native.getDeviceToken).toHaveBeenCalled();
  }));
});
