import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpContext } from '@angular/common/http';
import { StatePassingService } from '@services/state-services/state-passing.service';
import { lastValueFrom } from 'rxjs';
import {
  ERROR_PASS_THROUGH,
  SILENT_REQUEST,
} from '@app/interceptors/interceptor';

export type IndividualSessionCollection = {
  links: { self: string };
  results: [IndividualSession];
};
export type IndividualSession = {
  description?: string;
  host: object;
  participant: object;
  status: string;
  uniqueId: string;
  links: { individualSession: string };
};
export type RoomStatus = {
  present: boolean;
  roomCredentials: RoomCredentials;
};
export type RoomCredentials = {
  username: string;
  host: string;
  roomKey: string;
  roomPin: string;
};
export type HostStatus = { host: { present: boolean } };

@Injectable({
  providedIn: 'root',
})
export class IndividualSessionsApiService {
  constructor(
    private http: HttpClient,
    private appContext: StatePassingService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  private constants = Object.freeze({
    roomCredentials: 'roomCredentials',
    sessionUrl: 'individualSessionUrl',
    joinConferencePath: 'joinConference',
    loginPath: 'login',
    authenticationError: 'authenticationError',
  });

  joinSession = async (individualSession: IndividualSession): Promise<void> => {
    const context = new HttpContext()
      .set(SILENT_REQUEST, true)
      .set(ERROR_PASS_THROUGH, true);

    console.debug('Joining conference');
    console.debug('Individual session:', JSON.stringify(individualSession));
    const individualSessionUrl = individualSession.links.individualSession;
    const joinSessionUrl = Location.joinWithSlash(
      individualSessionUrl,
      'participant'
    );

    try {
      const body = { present: true };
      const roomStatus = await lastValueFrom(
        this.http.put<RoomStatus>(joinSessionUrl, body, { context: context })
      );

      console.debug('Room status:', JSON.stringify(roomStatus));
      this.appContext.requestParams.set(
        this.constants.roomCredentials,
        roomStatus.roomCredentials
      );
      this.appContext.requestParams.set(
        this.constants.sessionUrl,
        individualSessionUrl
      );

      void this.ngZone.run(() => {
        console.debug('Redirecting to join conference component');
        this.router.navigate([this.constants.joinConferencePath]);
      });
    } catch (error) {
      const msg =
        error instanceof HttpErrorResponse
          ? `Status: ${error.status}`
          : JSON.stringify(error);

      console.error('Could not join session %s. %s', individualSession, msg);
    }
  };

  leaveSession = async (individualSessionUrl: string): Promise<void> => {
    console.debug('Leaving individual session');

    const context = new HttpContext()
      .set(SILENT_REQUEST, true)
      .set(ERROR_PASS_THROUGH, true);

    console.debug(`Individual sessions URL: ${individualSessionUrl}`);

    const leaveSessionUrl = Location.joinWithSlash(
      individualSessionUrl,
      'participant'
    );

    const body = { present: false };

    try {
      await lastValueFrom(
        this.http.put(leaveSessionUrl, body, { context: context })
      );
      console.debug('Succesfully left individual session');
    } catch (error) {
      console.debug('Failed to leave individual session');
      console.debug(`Status: ${error}`);
    }
  };

  /**
   * Checks for pending individual sessions for the patient.
   */
  checkForSession = async (
    individualSessionsUrl: string
  ): Promise<IndividualSessionCollection | undefined> => {
    const patientSessionsUrl = new URL(individualSessionsUrl);
    patientSessionsUrl.searchParams.set('status', 'open');

    const context = new HttpContext()
      .set(SILENT_REQUEST, true)
      .set(ERROR_PASS_THROUGH, true);

    try {
      return lastValueFrom(
        this.http.get<IndividualSessionCollection>(
          patientSessionsUrl.toString(),
          {
            context: context,
          }
        )
      );
    } catch (error) {
      console.error(
        `Error occurred trying to check for pending individual sessions: ${error}`
      );
      return Promise.resolve(undefined);
    }
  };

  checkForSessionAndJoin = async (
    individualSessionsUrl: string
  ): Promise<void> => {
    const individualSessionCollection = await this.checkForSession(
      individualSessionsUrl
    );

    if (
      individualSessionCollection !== undefined &&
      individualSessionCollection.results.length > 0
    ) {
      this.joinSession(individualSessionCollection.results[0]);
    }
  };

  isHostPresent = (individualSessionUrl: string): Promise<HostStatus> => {
    const context = new HttpContext()
      .set(SILENT_REQUEST, true)
      .set(ERROR_PASS_THROUGH, true);

    return lastValueFrom(
      this.http.get<HostStatus>(individualSessionUrl, {
        context: context,
      })
    );
  };
}
