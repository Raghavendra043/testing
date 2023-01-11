import { Injectable } from '@angular/core';
import { IndividualSessionsApiService } from './individual-sessions-api.service';
import { VideoListenerService } from './video-listener.service';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(
    private individualSessionsApi: IndividualSessionsApiService,
    private videoListener: VideoListenerService
  ) {}

  checkForSessionAndJoin = this.individualSessionsApi.checkForSessionAndJoin;
  leaveSession = this.individualSessionsApi.leaveSession;
  isHostPresent = this.individualSessionsApi.isHostPresent;
  sessionEnded = this.videoListener.endSession;
  listenForNativeEvent = this.videoListener.listenForNativeEvent;
  listenForIncomingCall = this.videoListener.listenForIncomingCall;
}
