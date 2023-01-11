import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Message,
  MessageThread,
  ThreadMessagesResult,
  ThreadRef,
  ThreadsResult,
} from 'src/app/types/messages.type';
import { User } from 'src/app/types/user.type';
import { Utils } from '../util-services/util.service';
import {
  ERROR_PASS_THROUGH,
  SILENT_REQUEST,
} from '@app/interceptors/interceptor';
import {
  lastValueFrom,
  map,
  Observable,
  of,
  mergeMap,
  from,
  toArray,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageThreadsService {
  constructor(private http: HttpClient, private utils: Utils) {}

  list(user: User, errorPassThrough: boolean): Promise<ThreadsResult> {
    if (!this.utils.exists(user.links.threads)) {
      throw new TypeError(
        'User object does not contain a link relation to messageThreads'
      );
    }
    return lastValueFrom(
      this.http.get<ThreadsResult>(user.links.threads, {
        context: new HttpContext()
          .set(SILENT_REQUEST, true)
          .set(ERROR_PASS_THROUGH, errorPassThrough),
      })
    );
  }

  get(messageThreadRef: ThreadRef): Promise<MessageThread> {
    return lastValueFrom(
      this.http.get<MessageThread>(messageThreadRef.links.thread)
    );
  }

  markAsRead(thread: ThreadRef): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return lastValueFrom(
      this.http.post(thread.links.thread + '/read', '', {
        context: new HttpContext().set(SILENT_REQUEST, true),
        headers,
      })
    );
  }

  getMessages(thread: ThreadRef): Promise<any[]> {
    return lastValueFrom(
      this.http
        .get<ThreadMessagesResult>(thread.links.messages)
        .pipe(map((response: any) => response.results))
    );
  }

  postAttachment(user: User, file: File): Observable<string> {
    if (!file || !this.utils.exists(user.links.attachments)) {
      return of();
    }

    const headers = new HttpHeaders({ 'Content-Type': file.type });

    return this.http
      .post(user.links.attachments, file, {
        headers: headers,
        observe: 'response',
      })
      .pipe(
        map((response: any) => {
          const location = response.headers.get('location');
          if (!this.utils.exists(location))
            throw new Error('Unable to submit attachment');
          return location;
        })
      );
  }

  deleteAttachment(url: string) {
    return this.http.delete(url);
  }

  getAttachmentDataUrl(url: string): Observable<string> {
    return this.http
      .get(url, {
        responseType: 'blob',
        context: new HttpContext()
          .set(SILENT_REQUEST, true)
          .set(ERROR_PASS_THROUGH, true),
      })
      .pipe(
        mergeMap((blob: any) => {
          const reader = new FileReader();
          return new Observable<string>((subscriber: any) => {
            reader.onloadend;
            reader.onload = () => {
              subscriber.next(reader.result as string);
              subscriber.complete();
            };
            reader.readAsDataURL(blob);
          });
        })
      );
  }

  create(
    user: User,
    departmentUrl: string,
    body: string,
    files: File[]
  ): Observable<void> {
    const messagesUrl = user.links.messages;
    if (!this.utils.exists(messagesUrl)) {
      throw new TypeError(`User does not have any messages`);
    }

    return from(files).pipe(
      mergeMap((file) => this.postAttachment(user, file)),
      toArray(),
      mergeMap((fileUrls) => {
        const message = {
          body,
          sender: {
            name: `${user.firstName} ${user.lastName}`,
            type: 'patient',
          },
          links: {
            organization: departmentUrl,
            patient: user.links.self,
            attachments: fileUrls,
          },
        };
        return this.postMessage(message, messagesUrl);
      })
    );
  }

  private postMessage(message: object, messagesUrl: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post(messagesUrl, message, {
        context: new HttpContext().set(ERROR_PASS_THROUGH, true),
        headers,
      })
      .pipe(
        map(() => {
          return;
        })
      );
  }
}
