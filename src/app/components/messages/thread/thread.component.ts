import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageThreadsService } from 'src/app/services/rest-api-services/message-threads.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { Department, Message, ThreadRef } from 'src/app/types/messages.type';
import { ImagePreview } from 'src/app/types/image.type';
import { NgForm } from '@angular/forms';
import { Utils } from '@services/util-services/util.service';
import { LoadingState } from '@app/types/loading.type';
import { compareAsc } from 'date-fns';

type Model = {
  state: LoadingState;
  isSending: boolean;
  newMessage: string;
  hasOtherThreads: boolean;
  title: string;
  messages: any[];
  notifications: {
    info: string | undefined;
    error: string | undefined;
  };
  filePreviews: ImagePreview[];
};

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.less'],
})
export class ThreadComponent implements OnInit {
  model: Model = {
    state: 'Loading',
    isSending: false,
    newMessage: '',
    hasOtherThreads: false,
    title: '',
    messages: [],
    notifications: {
      info: undefined,
      error: undefined,
    },
    filePreviews: [],
  };
  selectedDepartment!: Department;
  @ViewChild(NgForm) ngForm!: NgForm;

  constructor(
    private appContext: StatePassingService,
    private messageThreads: MessageThreadsService,
    private translate: TranslateService,
    private router: Router,
    private utils: Utils
  ) {}

  ngOnInit() {
    if (!this.appContext.requestParams.containsKey('selectedDepartment')) {
      void this.router.navigate(['menu']);
      return;
    }
    const selectedDepartment =
      this.appContext.requestParams.get<Department>('selectedDepartment');
    if (!this.utils.exists(selectedDepartment)) {
      throw new Error('No selected department');
    }
    this.selectedDepartment = selectedDepartment;
    const hasOtherThreads =
      this.appContext.requestParams.get<boolean>('hasOtherThreads') ?? false;

    //@ts-ignore
    this.model = {
      ...this.model,
      hasOtherThreads,
      title: hasOtherThreads
        ? this.selectedDepartment.name
        : this.translate.instant('MESSAGES_TITLE'),
    };

    if (this.selectedDepartment.messageThread) {
      this.messageThreads
        .getMessages(this.selectedDepartment.messageThread)
        .then(this.onSuccess);
    } else {
      this.model.state = 'Loaded';
    }
  }

  isValid() {
    return (
      (this.model.newMessage && this.model.newMessage.length > 0) ||
      this.model.filePreviews.length > 0
    );
  }

  submit() {
    this.model.isSending = true;
    this.model.notifications.error = undefined;
    this.model.notifications.info = this.translate.instant('MESSAGES_SENDING');
    const message = {
      text: this.model.newMessage,
      sendDate: new Date(),
    };

    const onMessageCreateSuccess = () => {
      this.model.newMessage = ''; // To clear up form
      this.model.filePreviews = [];

      const tempMessageForView = {
        body: message.text,
        timestamp: new Date().toISOString(),
        sender: {
          type: 'patient',
        },
      };
      this.model.messages.push(tempMessageForView);

      this.model.notifications.info = this.translate.instant('MESSAGES_SENT');
      this.model.isSending = false;

      setTimeout(() => {
        this.model.notifications.info = undefined;
      }, 2000);

      if (this.selectedDepartment.messageThread) {
        this.messageThreads
          .getMessages(this.selectedDepartment.messageThread)
          .then(this.onSuccess);
      }
    };

    const onMessageCreateError = (error: unknown) => {
      this.model.isSending = false;
      this.model.notifications.info = undefined;
      this.model.notifications.error = this.translate.instant(
        'MESSAGES_ERROR_COULD_NOT_SEND'
      );
      console.error(error);
      console.error(`Failed to send message`);
    };

    const user = this.appContext.getUser();
    if (!this.utils.exists(user)) {
      throw new Error('No user currently logged in');
    }

    this.messageThreads
      .create(
        user,
        this.selectedDepartment.url,
        this.model.newMessage,
        this.model.filePreviews.map((i: ImagePreview) => i.file)
      )
      .subscribe({
        next: onMessageCreateSuccess,
        error: onMessageCreateError,
      });
  }

  refresh() {
    this.model.messages = [];
    this.messageThreads
      .getMessages(this.selectedDepartment.messageThread!)
      .then(this.onSuccess);
  }

  onSuccess = (messages: Message[]) => {
    this.model.state = 'Loaded';
    this.model.notifications.info = undefined;
    messages.sort((m1, m2) => {
      const date1 = new Date(m1.timestamp);
      const date2 = new Date(m2.timestamp);
      return compareAsc(date1, date2);
    });

    if (this.selectedDepartment.messageThread) {
      this.messageThreads.markAsRead(this.selectedDepartment.messageThread);
    }
    this.model.messages = messages;
  };

  onError = (data: unknown) => {
    this.model.notifications.info = undefined;
    this.model.state = 'Failed';
    console.error(`Failed to load messages due to error: ${data}`);
  };

  messageByTimestamp(index: number, message: any) {
    return message.timestamp;
  }

  attachmentByFull(index: number, attachment: any) {
    return attachment.full;
  }
}
