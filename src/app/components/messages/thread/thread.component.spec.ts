import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { HeaderModule } from '../../header/header.module';
import { MenuComponent } from '../../menu/menu/menu.component';
import { Location } from '@angular/common';
import { ThreadComponent } from './thread.component';
import { MessageThreadsService } from 'src/app/services/rest-api-services/message-threads.service';
import { FormsModule } from '@angular/forms';
import { ClickableLinksPipe } from 'src/app/pipes/clickable-links.pipe';
import { LoadingModule } from '../../loading/loading.module';
import { NotificationsModule } from '../../notifications/notifications.module';
import { ThreadImageComponent } from '../thread-image/thread-image.component';
import { ImagePickerComponent } from '../image-picker/image-picker.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { mockUser } from '@app/mocks/state-passing-service.mock';
import { MomentModule } from 'ngx-moment';
import { User } from '@app/types/user.type';
import { of } from 'rxjs';

class FakeMessageThreadService {
  public restServiceResult = [
    {
      body: 'Test',
      sender: {
        type: 'Organization',
        name: 'Afdeling-B Test',
      },
      timestamp: '2013-12-19T10:25:44.877+01:00',
      readAt: '2014-01-22T11:40:00.690+01:00',
    },
    {
      body: 'Foo bar',
      sender: {
        type: 'Organization',
        name: 'Afdeling-B Test',
      },
      timestamp: '2013-12-29T10:25:44.877+01:00',
      readAt: '2014-01-22T11:41:00.690+01:00',
      attachments: [
        {
          full: 'http://localhost/chat/attachments/1',
          thumbnail: 'http://localhost/chat/attachments/1/thumbnail',
        },
      ],
    },
  ];

  public restResult2 = {};
  getMessages = (threadRef: any) => {
    return Promise.resolve(this.restServiceResult);
  };
  create = (
    user: User | any,
    organizationUrl: string,
    body: string,
    files: File[]
  ) => {
    this.restResult2 = {
      //@ts-ignore
      user,
      organizationUrl,
      body,
      files,
    };
    return of(true);
  };
  markAsRead = (threadRef: any) => {
    return Promise.resolve(true);
  };
}

describe('ThreadComponent', () => {
  let component: ThreadComponent;
  let fixture: ComponentFixture<ThreadComponent>;
  let router: Router;
  let location: Location;
  let appContext: StatePassingService;

  let messagesThreadService: any;

  beforeEach(async () => {
    appContext = new StatePassingService(router);
    messagesThreadService = new FakeMessageThreadService();

    await TestBed.configureTestingModule({
      declarations: [
        ThreadComponent,
        MenuComponent,
        ClickableLinksPipe,
        ThreadImageComponent,
        ImagePickerComponent,
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'menu',
            component: MenuComponent,
          },
        ]),
        HeaderModule,
        LoadingModule,
        NotificationsModule,
        MomentModule,
      ],
      providers: [
        {
          provide: StatePassingService,
          useValue: appContext,
        },
        {
          provide: MessageThreadsService,
          useValue: messagesThreadService,
        },
      ],
    }).compileComponents();
  });

  async function init(fun?: any) {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    appContext = TestBed.get(StatePassingService);
    appContext.requestParams.set('selectedDepartment', {
      name: 'Afdeling-B Test',
      url: `http://localhost/organizations/123`,
      messageThread: {
        links: {
          messages: `http://localhost/chat/threads/123/messages`,
        },
      },
    });
    if (fun) {
      fun();
    }
    messagesThreadService = TestBed.get(MessageThreadsService);

    fixture = TestBed.createComponent(ThreadComponent);
    component = fixture.componentInstance;
    router.initialNavigation();

    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should be defined', async () => {
    await init();
    expect(component).toBeDefined();
  });

  it('should set current thread correctly', async () => {
    const setupThread = () => {
      appContext.requestParams.set('hasOtherThreads', true);
    };

    await init(setupThread);

    expect(component.model.title).toEqual('Afdeling-B Test');
    //@ts-ignore
    expect(component.selectedDepartment.messageThread.links.messages).toMatch(
      /threads\/123\/messages/
    );
  });

  it('should get all messages for user', async () => {
    await init();
    expect(component.model.messages.length).toEqual(2);
    expect(component.model.messages).toEqual(
      messagesThreadService.restServiceResult
    );
  });

  it('should set current recipient correctly', async () => {
    await init();
    //@ts-ignore
    expect(component.selectedDepartment.messageThread.links.messages).toEqual(
      'http://localhost/chat/threads/123/messages'
    );
  });

  it('should successfully post a new message', async () => {
    const setupUser = () => {
      appContext.currentUser.set(mockUser);
    };
    await init(setupUser);
    component.model.newMessage = 'Some text';
    component.submit();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(messagesThreadService.restResult2.organizationUrl).toEqual(
      'http://localhost/organizations/123'
    );
    expect(messagesThreadService.restResult2.body).toEqual('Some text');
  });
});
