import { Injectable } from "@angular/core";
import {
  Callback,
  Handler,
  Message,
  DeviceMeasurementRequestMessage,
} from "@app/types/native.type";
import { QuestionnaireScheduleSummary } from "@app/types/questionnaire-schedules.type";

@Injectable({
  providedIn: "root",
})
export class NativeService {
  private subscriptions: any = {};

  private nativeAvailable = false;

  constructor() {}

  publishMessageFromNative = (message: Message) => {
    if (!this.subscriptions.hasOwnProperty(message.messageType)) {
      console.debug(
        `No message handlers found to handle message from native layer: ${message.messageType}`
      );
    }

    const handlers = this.subscriptions[message.messageType];
    const handlersStillRegistered: any = [];

    handlers?.forEach((handler: Handler) => {
      console.debug(`invoking handler for messageType: ${message.messageType}`);

      if (handler.autoUnregister === true) {
        handler.handleMessage(message);
      } else {
        handler.handleMessage(message);
        handlersStillRegistered.push(handler);
      }
    });

    this.subscriptions[message.messageType] = handlersStillRegistered;
  };

  enableMessagesFromNative = (): void => {
    const sendMessageToWebView = (rawMessage: string): void => {
      console.debug(`message from native layer received: ${rawMessage}`);
      const parsedMessage = JSON.parse(rawMessage);
      this.publishMessageFromNative(parsedMessage);
    };

    globalThis.sendMessageToWebView = sendMessageToWebView;
  };

  private removeSecretFields = (message: Message) => {
    const clone = JSON.parse(JSON.stringify(message));
    delete clone.credentials;
    return clone;
  };

  sendMessageToNative = (message: Message): boolean => {
    const msgAsString = JSON.stringify(message);
    const messageToLog = this.removeSecretFields(message);

    console.debug(
      "Sending message to native layer: " + JSON.stringify(messageToLog)
    );

    if (globalThis.external?.notify) {
      globalThis.external.notify(msgAsString);
      return true;
    } else if (
      globalThis.webkit?.messageHandlers?.notify?.postMessage !== undefined
    ) {
      globalThis.webkit.messageHandlers.notify.postMessage(msgAsString);
      return true;
    } else {
      console.debug("Couldnt' deliver message to native layer");
      return false;
    }
  };

  isAvailable() {
    //@ts-ignore
    if (globalThis.external?.notify) {
      return true;
    } else if (
      globalThis.webkit?.messageHandlers?.notify?.postMessage !== undefined
    ) {
      return true;
    } else {
      console.debug("No native layer found");
      return false;
    }
  }

  private addSubscription = (
    messageType: string,
    callback: Callback,
    autoUnregister: boolean
  ) => {
    if (!this.subscriptions.hasOwnProperty(messageType)) {
      this.subscriptions[messageType] = [];
    }
    const callbackTag = this.calculateCallbackTag(callback);

    if (
      this.notAlreadySubscribed(this.subscriptions[messageType], callbackTag)
    ) {
      console.debug(`Subscribing to ${messageType}`);
      this.subscriptions[messageType].push({
        handleMessage: callback,
        autoUnregister: autoUnregister,
        callbackTag: callbackTag,
      });
    } else {
      console.debug("Provided callback already subscribed to " + messageType);
    }
  };

  private calculateCallbackTag = (callback: Callback): number => {
    const asStr = callback.toString();
    let tag: number = 0;
    for (let i = 0; i < asStr.length; i++) {
      tag = (Math.imul(31, tag) + asStr.charCodeAt(i)) | 0;
    }

    console.debug(`Subscription callback tag: ${tag}`);
    return tag;
  };

  private notAlreadySubscribed = (
    subscribers: any[],
    callbackTag: number
  ): boolean => {
    return !subscribers.some((s) => s.callbackTag === callbackTag);
  };

  subscribeToSingleMessage = (
    messageType: string,
    callback: Callback
  ): void => {
    this.addSubscription(messageType, callback, true);
  };

  subscribeToMultipleMessages = (
    messageType: string,
    callback: Callback
  ): void => {
    this.addSubscription(messageType, callback, false);
  };

  unsubscribe = (messageType: string, callback: Callback): void => {
    if (this.subscriptions.hasOwnProperty(messageType)) {
      const remainingSubscriptions: any = [];

      this.subscriptions[messageType].forEach((handler: Handler) => {
        if (handler.handleMessage !== callback) {
          remainingSubscriptions.push(handler);
        }
      });

      this.subscriptions[messageType] = remainingSubscriptions;
    }
  };

  unsubscribeAll = (messageType: string): void => {
    if (this.subscriptions.hasOwnProperty(messageType)) {
      this.subscriptions[messageType] = [];
    }
  };

  /**
   * Tries to open a URL first by asking the native layer and if it doesn't
   * exist, then directly by the browser.
   */
  openUrl = (url: string): void => {
    const request: any = {
      messageType: "openUrlRequest",
      url: url,
    };
    const handledByNative = this.sendMessageToNative(request);
    if (!handledByNative) {
      globalThis.open(url);
    }
  };

  enableClientLogging = (callback: Callback): boolean => {
    this.subscribeToMultipleMessages("logMessagesReady", callback);

    const request: any = {
      messageType: "clientLoggingEnabled",
    };
    return this.sendMessageToNative(request);
  };

  getDeviceToken = (callback: Callback): boolean => {
    this.subscribeToMultipleMessages("deviceTokenResponse", callback);

    const request: any = {
      messageType: "deviceTokenRequest",
    };
    return this.sendMessageToNative(request);
  };

  clearScheduledQuestionnaire = (questionnaireId: number): boolean => {
    const request: Message = {
      messageType: "clearScheduledQuestionnaireRequest",
      questionnaireId: questionnaireId,
    };
    return this.sendMessageToNative(request);
  };

  updateScheduledQuestionnaires = (
    scheduledQuestionnaires: QuestionnaireScheduleSummary[]
  ): boolean => {
    const request: Message = {
      messageType: "updateScheduledQuestionnairesRequest",
      scheduledQuestionnaires: scheduledQuestionnaires,
    };
    return this.sendMessageToNative(request);
  };

  clearUnreadMessages = (): boolean => {
    const request: any = {
      messageType: "clearUnreadMessagesRequest",
    };
    return this.sendMessageToNative(request);
  };

  clientIsVideoEnabled = (callback: Callback): boolean => {
    this.subscribeToSingleMessage("videoEnabledResponse", callback);
    const request: any = {
      messageType: "videoEnabledRequest",
    };
    return this.sendMessageToNative(request);
  };

  joinConference = (videoConferenceDescription: any): boolean => {
    const request: any = {
      messageType: "startVideoConferenceRequest",
      videoConference: videoConferenceDescription,
    };
    return this.sendMessageToNative(request);
  };

  leaveConference = (): boolean => {
    const request: any = {
      messageType: "stopVideoConferenceRequest",
    };
    return this.sendMessageToNative(request);
  };

  playNotificationSound = (): boolean => {
    const request: any = {
      messageType: "startNotificationSoundRequest",
    };
    return this.sendMessageToNative(request);
  };

  stopNotificationSound = (): boolean => {
    const request: any = {
      messageType: "stopNotificationSoundRequest",
    };
    return this.sendMessageToNative(request);
  };

  addDeviceListener = (meterType: string, parameters: object): boolean => {
    const request: DeviceMeasurementRequestMessage = {
      messageType: "deviceMeasurementRequest",
      meterType: meterType,
      parameters: parameters,
    };

    return this.sendMessageToNative(request);
  };

  removeDeviceListeners = (): boolean => {
    const request: any = {
      messageType: "stopDeviceMeasurementRequest",
    };
    this.unsubscribeAll("deviceMeasurementResponse");
    return this.sendMessageToNative(request);
  };

  showConfirmDialog = (
    text: string,
    okButtonText: string,
    cancelButtonText: string,
    onClosed: Callback
  ): void => {
    this.subscribeToSingleMessage("showPopupDialogResponse", (resp: any) =>
      onClosed(resp.result)
    );

    const request: any = {
      messageType: "showPopupDialogRequest",
      text: text,
      showCancelButton: true,
      okButtonText: okButtonText,
      cancelButtonText: cancelButtonText,
    };

    const handledByNative = this.sendMessageToNative(request);
    if (!handledByNative) {
      const result = globalThis.confirm(text);
      onClosed(result);
    }
  };

  showAlertDialog = (
    text: string,
    okButtonText: string,
    onClosed: Callback
  ): void => {
    this.subscribeToSingleMessage("showPopupDialogResponse", onClosed);

    const request: any = {
      messageType: "showPopupDialogRequest",
      text: text,
      showCancelButton: false,
      okButtonText: okButtonText,
    };
    const handledByNative = this.sendMessageToNative(request);
    if (!handledByNative) {
      globalThis.alert(text);
      onClosed();
    }
  };
}

declare module globalThis {
  let alert: (text: string) => void;
  let confirm: (text: string) => void;
  let open: (url: string) => void;
  let sendMessageToWebView: (rawMessage: string) => void;
  let external: {
    notify: (msg: string) => void;
  };
  let webkit: {
    messageHandlers: {
      notify: {
        postMessage: (msg: string) => void;
      };
    };
  };
}
