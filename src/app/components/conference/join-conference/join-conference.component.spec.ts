import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Idle } from '@ng-idle/core';
import { TranslateModule } from '@ngx-translate/core';
import { FakeIdle } from 'src/app/mocks/idle.mock';
import { FakeVideoService } from 'src/app/mocks/video-service.mock';
import { NativeService } from 'src/app/services/native-services/native.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { VideoService } from 'src/app/services/video-services/video.service';
import { HeaderModule } from '../../header/header.module';
import { JoinConferenceComponent } from './join-conference.component';
import { ConfigService } from '@services/state-services/config.service';
import { FakeConfigService } from '@app/mocks/config-service.mock';

describe('JoinConferenceComponent', () => {
  let component: JoinConferenceComponent;
  let router: Router;
  let fixture: ComponentFixture<JoinConferenceComponent>;
  let appContext: StatePassingService;
  let idleService: FakeIdle;
  let nativeService: NativeService;

  let videoFacade: FakeVideoService;
  const roomCredentials = {
    username: 'nancyann',
    host: {
      present: true,
    },
    roomKey: 'some-room-key',
    roomPin: 'some-room-pin',
  };

  beforeEach(async () => {
    videoFacade = new FakeVideoService(roomCredentials);
    idleService = new FakeIdle();
    appContext = new StatePassingService(router);
    appContext.requestParams.set(
      'individualSessionUrl',
      'https://oth-box.oth.io/individual_sessions/42'
    );
    appContext.requestParams.set('roomCredentials', roomCredentials);

    await TestBed.configureTestingModule({
      declarations: [JoinConferenceComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        HeaderModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provice: NativeService, useValue: new NativeService() },
        { provide: StatePassingService, useValue: appContext },
        { provide: VideoService, useValue: videoFacade },
        { provide: Idle, useValue: idleService },
        { provide: ConfigService, useClass: FakeConfigService },
      ],
    }).compileComponents();
  });

  function init(fun?: any) {
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(JoinConferenceComponent);
    component = fixture.componentInstance;
    nativeService = TestBed.get(NativeService);
    if (fun) {
      fun();
    }
    fixture.detectChanges();
  }

  it('should be defined', () => {
    init();
    expect(component).toBeDefined();
  });

  it('should set scope model correctly', () => {
    init();
    expect(component.model.header).toEqual('CONFERENCE_JOIN_HEADER');
    expect(component.model.message).toEqual('CONFERENCE_JOIN_MESSAGE');
    expect(component.model.state).toEqual('prompted');
  });

  it('should call join conference when accepting a call', () => {
    const spyFn = () => {
      spyOn(nativeService, 'playNotificationSound');
      spyOn(nativeService, 'stopNotificationSound');
      spyOn(nativeService, 'joinConference');
      spyOn(videoFacade, 'listenForNativeEvent');
    };
    init(spyFn);

    expect(nativeService.playNotificationSound).toHaveBeenCalled();
    expect(videoFacade.listenForNativeEvent).not.toHaveBeenCalled();

    component.acceptCall();
    fixture.detectChanges();
    fixture.whenStable();

    expect(nativeService.stopNotificationSound).toHaveBeenCalled();
    expect(component.model.message).toEqual('CONFERENCE_JOINING_MESSAGE');
    expect(component.model.state).toEqual('joining');
    expect(videoFacade.listenForNativeEvent).toHaveBeenCalled();

    const expectedVideoConferenceDescription = {
      isOneOnOne: true,
      videoType: 'vidyo',
      parameters: roomCredentials,
    };

    expect(nativeService.joinConference).toHaveBeenCalledWith(
      expectedVideoConferenceDescription
    );
  });

  it('should not disable idle checking before accepting a call', () => {
    const spyFn = () => {
      spyOn(idleService, 'stop');
    };
    init(spyFn);
    expect(idleService.stop).not.toHaveBeenCalled();
  });

  it('should disable idle checking when accepting a video conference', () => {
    const spyFn = () => {
      spyOn(idleService, 'stop');
    };
    init(spyFn);
    component.acceptCall();
    fixture.detectChanges();
    fixture.whenStable();
    expect(idleService.stop).toHaveBeenCalled();
  });
});
