import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NativeService } from '../native-services/native.service';
import { IndividualSessionsApiService } from './individual-sessions-api.service';
import { NativeEvent, StatusEvent } from 'src/app/types/listener.type';
import { VideoConferenceResponseMessage } from 'src/app/types/native.type';

@Injectable({
  providedIn: 'root',
})
export class VideoListenerService {
  constructor(
    private native: NativeService,
    private individualSessionsApi: IndividualSessionsApiService,
    private router: Router
  ) {}

  /**
   * Listens for 'videoConferenceResponse' events received from the native layer.
   */
  texts = Object.freeze({
    conferenceStarted: 'CONFERENCE_STARTED',
    conferenceEnded: 'CONFERENCE_ENDED',
    conferenceError: 'CONFERENCE_ERROR',
  });

  constants = Object.freeze({
    status: 'status',
    info: 'info',
    error: 'error',
    timeoutInMillis: 3000,
    menuPath: '/menu',
    videoConferenceResponse: 'videoConferenceResponse',
    incomingVideoCall: 'incomingVideoCall',
  });

  states = Object.freeze({
    prompted: 'prompted',
    joining: 'joining',
    joined: 'joined',
    disconnected: 'disconnected',
  });

  listenForNativeEvent = (individualSessionUrl: string, model: object) => {
    const nativeVideoEventCallback = (
      message: VideoConferenceResponseMessage
    ) => {
      this.handleEvent(individualSessionUrl, model, message.event);
    };

    this.native.subscribeToMultipleMessages(
      this.constants.videoConferenceResponse,
      nativeVideoEventCallback
    );
  };

  listenForIncomingCall = (individualSessionsUrl: string) => {
    this.native.unsubscribeAll(this.constants.incomingVideoCall);
    this.native.subscribeToMultipleMessages(
      this.constants.incomingVideoCall,
      () => {
        console.debug("received 'incomingVideoCall' message");
        this.individualSessionsApi.checkForSessionAndJoin(
          individualSessionsUrl
        );
      }
    );
  };

  handleEvent = (
    individualSessionUrl: string,
    model: object,
    event: NativeEvent
  ) => {
    console.debug(`Event: ${JSON.stringify(event)}`);
    const eventType = event.type;

    switch (eventType) {
      case this.constants.status:
        this.handleStatusEvent(individualSessionUrl, model, event);
        break;

      default:
        console.warn(`Unknown event type: ${eventType}`);
        break;
    }
  };

  handleStatusEvent = (
    individualSessionUrl: string,
    model: object,
    event: any
  ) => {
    const status = event.status;
    const statusType = status.type;
    const message = status.message;

    switch (statusType) {
      case this.constants.error:
        this.handleErrorEvent(individualSessionUrl, model, message);
        break;

      case this.constants.info:
        this.handleInfoEvent(individualSessionUrl, model, message);
        break;

      default:
        console.warn(`Unknown status type: ${statusType}`);
        break;
    }
  };

  handleErrorEvent = (
    individualSessionUrl: string,
    model: any,
    message: string
  ) => {
    model.state = this.states.disconnected;

    switch (message) {
      case this.texts.conferenceError:
        this.endSession(individualSessionUrl);
        break;

      default:
        model.error = message;
        break;
    }
  };

  handleInfoEvent = (
    individualSessionUrl: string,
    model: any,
    message: string
  ) => {
    model.message = message;

    switch (message) {
      case this.texts.conferenceStarted:
        console.debug('Conference started');
        model.state = this.states.joined;
        break;

      case this.texts.conferenceEnded:
        model.state = this.states.disconnected;
        this.endSession(individualSessionUrl);
        break;

      default:
        console.debug(`Info message received: ${JSON.stringify(message)}`);
        model.info = message;
        break;
    }
  };

  endSession = (individualSessionUrl: string) => {
    console.debug('CONFERENCE ENDED');

    this.individualSessionsApi.leaveSession(individualSessionUrl);

    const leftConference = this.native.leaveConference();
    if (!leftConference) {
      console.debug("Couldn't leave conference");
    }
    this.native.unsubscribeAll(this.constants.videoConferenceResponse);

    this.router.navigate([this.constants.menuPath]);
  };
}
