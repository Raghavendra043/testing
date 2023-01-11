import { HttpClient, HttpContext, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NativeService } from "src/app/services/native-services/native.service";
import { Utils } from "src/app/services/util-services/util.service";
import {
  DeviceOS,
  DeviceRegistration,
  DeviceResult,
} from "src/app/types/device-os.type";
import { User } from "src/app/types/user.type";
import {
  ERROR_PASS_THROUGH,
  SILENT_REQUEST,
} from "@app/interceptors/interceptor";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  constructor(
    private native: NativeService,
    private util: Utils,
    private http: HttpClient
  ) {}

  registrationPromise: Promise<any> | undefined;

  /**
   * Clears state about user having registered for push notifications.
   */
  clearPushNotificationRegistrationState = () => {
    this.registrationPromise = undefined;
  };

  /**
   * Tries to register a user's device for push notifications.
   */
  registerDeviceForPushNotifications = (user: User | any): Promise<any> => {
    const registrationPromise = new Promise((accept: any, reject: any) => {
      const deviceTokenRequested = this.native.getDeviceToken(
        ({ deviceToken, deviceOS }: any) =>
          this.registerDevice(user, deviceToken, deviceOS)
            .then(() => {
              console.debug(
                `Device with token: '${deviceToken}' successfully registered for push notifications`
              );
              accept();
            })
            .catch(() => {
              console.error(
                `Failed to register device token: ${deviceToken} for push notifications`
              );
            })
      );

      if (!deviceTokenRequested) {
        console.debug("Couldn't request device token");
      }
    });
    return registrationPromise;
  };

  /**
   * Registers a device for push notifications if it was not, and returns (in a promise)
   * a boolean indicading whether the registration has succeeded or not.
   */
  ensureDeviceRegisteredForPushNotifications = (
    user: User
  ): Promise<boolean> => {
    if (!this.registrationPromise) {
      return this.registerDeviceForPushNotifications(user);
    }

    return this.registrationPromise.then(
      () => true,
      () => false
    );
  };

  /**
   * Tries to register a user's device for push notifications.
   */
  registerDevice = async (
    user: User | any,
    deviceToken: string,
    deviceOS: DeviceOS
  ): Promise<DeviceRegistration> => {
    if (
      !this.util.exists(user.links?.notifications) ||
      !this.util.exists(user.links?.self)
    ) {
      throw new TypeError(
        "User object is missing a link to either 'patient' or 'notifications'"
      );
    }

    const context = new HttpContext()
      .set(ERROR_PASS_THROUGH, true)
      .set(SILENT_REQUEST, true);

    const patientUrl = user.links.self;
    const devicesUrl = user.links.notifications;
    const searchUrl = devicesUrl + "?patientUrl=" + patientUrl;

    const response = await lastValueFrom(
      this.http.get<DeviceResult>(searchUrl, { context })
    );

    const device = response.results.find(
      ({ patientUrl: url }) => url === patientUrl
    );

    if (
      this.util.exists(device) &&
      this.util.exists(device.links) &&
      this.util.exists(device.links.device)
    ) {
      const devicePayload = {
        patientUrl: device.patientUrl,
        deviceToken: deviceToken,
        deviceOS: deviceOS,
      };

      // Update existing
      return lastValueFrom(
        this.http.put<DeviceRegistration>(device.links.device, devicePayload, {
          context,
        })
      );
    } else {
      // Register new
      return lastValueFrom(
        this.http.post<DeviceRegistration>(devicesUrl, {
          patientUrl,
          deviceToken,
          deviceOS,
        })
      );
    }
  };
}
