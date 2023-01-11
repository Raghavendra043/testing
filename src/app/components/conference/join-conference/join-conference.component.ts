import { Component, OnInit } from "@angular/core";
import { Idle } from "@ng-idle/core";
import { NativeService } from "src/app/services/native-services/native.service";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { VideoService } from "src/app/services/video-services/video.service";
import { HostStatus } from "src/app/services/video-services/individual-sessions-api.service";

const ROOM_CREDENTIALS = "roomCredentials";
const SESSION_URL = "individualSessionUrl";
const VIDEO_TYPE = "vidyo";
const TIMEOUT_MILLIS = 7000;

enum States {
  PROMPTED = "prompted",
  JOINING = "joining",
  JOINED = "joined",
  DISCONNECTED = "disconnected",
}

const texts = Object.freeze({
  header: "CONFERENCE_JOIN_HEADER",
  joining: "CONFERENCE_JOINING_MESSAGE",
  join: "CONFERENCE_JOIN_MESSAGE",
  joinButton: "CONFERENCE_JOIN_BUTTON",
});
type Text = typeof texts[keyof typeof texts];

@Component({
  selector: "app-join-conference",
  templateUrl: "./join-conference.component.html",
  styleUrls: ["./join-conference.component.less"],
})
export class JoinConferenceComponent implements OnInit {
  readonly states = States;
  readonly texts = texts;

  model: {
    header: Text;
    message: Text;
    state: States;
  } = {
    header: texts.header,
    message: texts.join,
    state: States.PROMPTED,
  };

  constructor(
    private native: NativeService,
    private appContext: StatePassingService,
    private videoFacade: VideoService,
    private idle: Idle
  ) {}

  ngOnInit() {
    this.checkHostIsPresent();
    const startSoundRequestDelivered = this.native.playNotificationSound();
    if (!startSoundRequestDelivered) {
      console.debug(
        "Couldn't play notification sound due to missing native layer"
      );
    }
  }

  acceptCall() {
    const stopSoundRequestDelivered = this.native.stopNotificationSound();
    if (!stopSoundRequestDelivered) {
      console.debug(
        "Couldn't stop notification sound due to missing native layer"
      );
    }

    this.idle.stop();
    this.model.message = texts.joining;
    this.model.state = States.JOINING;

    const parameters = this.appContext.requestParams;
    const roomCredentials = parameters.getAndClear(ROOM_CREDENTIALS) as string;
    const individualSessionUrl = parameters.getAndClear(SESSION_URL) as string;

    const videoConferenceDescription = Object.freeze({
      isOneOnOne: true,
      videoType: VIDEO_TYPE,
      parameters: roomCredentials,
    });

    this.videoFacade.listenForNativeEvent(individualSessionUrl, this.model);
    const joinConferenceRequestDelivered = this.native.joinConference(
      videoConferenceDescription
    );
    if (!joinConferenceRequestDelivered) {
      console.debug("Couldn't join conference due to missing native layer");
    }
  }

  checkHostIsPresent() {
    console.debug("Check if host is still present");
    const parameters = this.appContext.requestParams;
    const individualSessionUrl = parameters.get(SESSION_URL) as string;
    let retries = 0;

    const doCheck = () => {
      const onSuccess = (hostStatus: HostStatus) => {
        const host = hostStatus?.host;
        if (host?.present == false) {
          console.debug("Host not present, ending conference");

          const stopSoundRequestDelivered = this.native.stopNotificationSound();
          if (!stopSoundRequestDelivered) {
            console.debug(
              "Couldn't stop notification sound due to missing native layer"
            );
          }

          this.model.state = States.DISCONNECTED;
          this.videoFacade.sessionEnded(individualSessionUrl);
        } else {
          if (this.model.state === States.DISCONNECTED) {
            console.debug(
              "Meeting stopped by other source, will stop " +
                "checking if host is present"
            );
          } else {
            setTimeout(() => {
              doCheck();
            }, TIMEOUT_MILLIS);
          }
        }
      };

      const onError = () => {
        console.debug(
          `Failed to check if host is still present, status: response.status`
        );

        if (retries >= 3) {
          console.debug("Maximum number of retries reached, ending conference");

          const stopSoundRequestDelivered = this.native.stopNotificationSound();
          if (!stopSoundRequestDelivered) {
            console.debug(
              "Couldn't stop notification sound due to missing native layer"
            );
          }

          this.videoFacade.sessionEnded(individualSessionUrl);
        } else {
          console.debug("Retrying 'check if host is still present'");
          retries += 1;

          setTimeout(() => {
            doCheck();
          }, TIMEOUT_MILLIS);
        }
      };

      this.videoFacade
        .isHostPresent(individualSessionUrl)
        .then(onSuccess)
        .catch(onError);
    };
    doCheck();
  }
}
