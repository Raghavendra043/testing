import { Injectable } from '@angular/core';

Injectable();
export class FakeNotificationsService {
  registerDeviceForPushNotifications(user: any): any {
    return undefined;
  }
  clearPushNotificationRegistrationState() {}

  ensureDeviceRegisteredForPushNotifications() {
    return Promise.resolve(true);
  }
}
