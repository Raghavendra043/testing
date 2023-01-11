import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { MessagesComponent } from "./messages.component";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ThreadComponent } from "../thread/thread.component";
import { TranslateModule } from "@ngx-translate/core";
import { RouterTestingModule } from "@angular/router/testing";
import { HeaderModule } from "../../header/header.module";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";
import { NativeService } from "src/app/services/native-services/native.service";
import { FakeMessageThreadService2 } from "src/app/mocks/message-threads-service.mock";
import { Department, ThreadRef } from "@app/types/messages.type";
import { Organization } from "@app/types/organization.type";
import { User } from "@app/types/user.type";
import { MessageThreadsService } from "@app/services/rest-api-services/message-threads.service";
import { LoadingModule } from "../../loading/loading.module";
import { mockUser } from "@app/mocks/state-passing-service.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let router: any;
  let location: Location;
  let stateService: StatePassingService;
  let messagesThreadService: any;
  let nativeService: NativeService;

  const beforeEachAsyncFn = async () => {
    stateService = new StatePassingService(router);
    messagesThreadService = new FakeMessageThreadService2();

    await TestBed.configureTestingModule({
      declarations: [MessagesComponent, ThreadComponent],

      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'messages/:id/thread',
            component: ThreadComponent,
          },
        ]),
        HeaderModule,
        LoadingModule,
      ],
      providers: [
        {
          provide: StatePassingService,
          useValue: stateService,
        },
        {
          provide: NativeService,
          useValue: new NativeService(),
        },
        {
          provide: MessageThreadsService,
          useValue: messagesThreadService,
        },
      ],
    }).compileComponents();
  };

  const beforeEachFn = (fn?: any) => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    stateService = TestBed.get(StatePassingService);
    messagesThreadService = TestBed.get(MessageThreadsService);
    nativeService = TestBed.get(NativeService);
    stateService.currentUser.set(mockUser);

    if (fn) {
      fn();
    }
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    router.initialNavigation();
    fixture.detectChanges();
  };

  const instantiateComponent = (fn?: any) => {
    beforeEachAsyncFn();
    beforeEachFn(fn);
  };

  it('should be defined', fakeAsync(() => {
    instantiateComponent();
    tick();
    expect(component).toBeDefined();
  }));

  it('should clear unread messages and get all recipients for user', fakeAsync(() => {
    const setupSpy = () => {
      spyOn(nativeService, 'clearUnreadMessages');
    };
    instantiateComponent(setupSpy);
    tick();

    expect(
      component.model.departments.map((d: Department) => d.name).sort()
    ).toEqual(
      [
        ...messagesThreadService.restServiceResult.results.map(
          (r: ThreadRef) => r.organizationName
        ),
        //@ts-ignore
        ...stateService.currentUser
          .get()
          .organizations.map((o: Organization) => o.name),
      ].sort()
    );
    expect(nativeService.clearUnreadMessages).toHaveBeenCalled();
  }));

  it('should open threads when clicked', fakeAsync(() => {
    instantiateComponent();
    tick();
    const id = 1;
    component.showMessageThread(id);
    fixture.detectChanges();
    tick();

    expect(location.path()).toEqual('/messages/1/thread');
    expect(
      messagesThreadService.restServiceResult.results.map(
        (r: any) => r.organizationName
      )
    ).toContain(
      //@ts-ignore
      stateService.requestParams.getAndClear('selectedDepartment').name
    );
  }));

  it('should automatically redirect to thread if list only contains one', fakeAsync(() => {
    const setupUser = () => {
      messagesThreadService.restServiceResult = {
        results: [
          {
            unreadFromOrganization: 2,
            unreadFromPatient: 0,
            organizationName: 'Obstetrisk Y, AUH, RM',
            latestMessageAt: '2021-12-07T00:01:00Z',
            links: {
              thread: 'http://localhost/threads/6',
              messages: 'http://localhost/threads/6/messages',
              organization: 'http://localhost/organizations/6',
              patient: 'http://localhost/patient/1',
            },
          },
        ],
        links: {
          self: 'http://localhost/threads',
        },
      };

      stateService.currentUser.set({
        firstName: 'first name',
        lastName: 'last name',
        //@ts-ignore
        links: {
          messages: 'http://localhost/rest/messages/recipients',
        },
        organizations: [],
      });
    };

    instantiateComponent(setupUser);
    tick();

    expect(location.path()).toEqual('/messages/0/thread');
  }));
});
