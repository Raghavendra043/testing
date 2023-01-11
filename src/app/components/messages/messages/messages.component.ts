import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NativeService } from "src/app/services/native-services/native.service";
import { MessageThreadsService } from "src/app/services/rest-api-services/message-threads.service";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { Department, ThreadsResult } from "src/app/types/messages.type";
import { MessagesModel } from "src/app/types/model.type";
import { User } from "src/app/types/user.type";

@Component({
  selector: "app-messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.less"],
})
export class MessagesComponent {
  model: MessagesModel = {
    state: "Loading",
    departments: [],
  };
  user: User;

  constructor(
    private appContext: StatePassingService,
    private messageThreads: MessageThreadsService,
    private native: NativeService,
    private router: Router
  ) {
    this.user = this.appContext.getUser();
    this.messageThreads
      .list(this.user, false)
      .then(this.onSuccess)
      .catch(this.onError);
  }

  showMessageThread = (selected: number): void => {
    const departments = this.model.departments;
    const threadRef = departments[selected];
    const hasOtherThreads = departments.length > 1;
    this.appContext.requestParams.set("selectedDepartment", threadRef);
    this.appContext.requestParams.set("hasOtherThreads", hasOtherThreads);
    if (this.model.departments.length === 1) {
      this.router.navigate(["messages/" + selected + "/thread"], {
        replaceUrl: true,
      });
    } else {
      this.router.navigate(["messages/" + selected + "/thread"]);
    }
  };

  onSuccess = (data: ThreadsResult): void => {
    const existingThreads: Department[] = data.results.map((t) => ({
      name: t.organizationName,
      url: t.links.organization,
      unreadCount: t.unreadFromOrganization,
      messageThread: t,
    }));
    const availableDepartments: Department[] = this.user.organizations.map(
      (org: any) => ({
        name: org.name,
        url: org.url,
        messageThread: undefined,
        unreadCount: 0,
      })
    );

    const departments: { [url: string]: Department } = {};
    for (const thread of [...availableDepartments, ...existingThreads]) {
      departments[thread.url] = thread;
    }

    this.model.departments = Object.values(departments);

    this.model.state = "Loaded";
    const clearMessagesRequestDelivered = this.native.clearUnreadMessages();
    if (!clearMessagesRequestDelivered) {
      console.debug("Couldn't clear unread messages due to missing native layer");
    }

    if (this.model.departments.length === 1) {
      this.showMessageThread(0);
    }
  };

  onError = (data: object) => {
    this.model.state = "Failed";
    console.error(`Failed to load messages due to error: ${data}`);
  };
}
