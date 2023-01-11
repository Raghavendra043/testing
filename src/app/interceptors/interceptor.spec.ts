// import { HttpClient } from '@angular/common/http';
// import {
//   HttpClientTestingModule,
//   HttpTestingController,
// } from '@angular/common/http/testing';
// import { fakeAsync, TestBed, tick } from '@angular/core/testing';
// import { Interceptor } from './interceptor';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { HttpNotificationsService } from '@services/rest-api-services/http-notifications.service';
// import { NotificationsService } from '@services/rest-api-services/notifications.service';
// import { Router } from '@angular/router';
// import { StatePassingService } from '@services/state-services/state-passing.service';

// describe('HttpInterceptorService', () => { // TODO: Make these interceptor tests pass later on. 
//   // let httpService: HttpService;
//   // let httpMock: HttpTestingController;
//   let interceptor: Interceptor;
//   let http: HttpClient;
//   let httpNotifications: HttpNotificationsService;
//   let router: Router;
//   let appContext: StatePassingService;
//   // mock your loaderService to ensure no issues
//   // let mockLoaderService = { setStatus: () => void };

//   beforeEach(() => {
//     // httpNotifications = new HttpNotificationsService();
//     // appContext = new StatePassingService(router);
//     // interceptor = new Interceptor(appContext, router, httpNotifications);
//     // router.onSameUrlNavigation = 'reload';
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         //  HttpService,
//         // {
//         //   provide: HTTP_INTERCEPTORS,
//         //   useClass: Interceptor,
//         //   multi: true,
//         // },
//         // {
//         //   provide: HttpNotificationsService,
//         //   useValue: new HttpNotificationsService(),
//         // },
//         Interceptor,
//         HttpNotificationsService,
//         // provide the mock when the unit test requires
//         // LoaderService
//         // { provide: LoaderService, useValue: mockLoaderService },
//       ],
//     });
//     http = TestBed.get(HttpClient);
//     //   httpMock = TestBed.get(HttpTestingController);
//     interceptor = TestBed.get(Interceptor);
//     httpNotifications = TestBed.get(HttpNotificationsService);
//   });

//   //  it('should increment the counter for all api's except getUsers', ()=> {
//   //     httpService.get('getAdminList').subscribe(res => {
//   //       expect(res).toBeTruthy();
//   //       expect(interceptor.counter).toBeGreaterThan(0);
//   //     });
//   //  });
//   // add this unit test
//   //     it('should decrement the counter for getUsers', ()=> {
//   //     httpService.get('getUsers').subscribe(res => {
//   //       expect(res).toBeTruthy();
//   //       expect(interceptor.counter).toBe(0);
//   //     });
//   //  });

//   describe('http notifications interceptor', () => {
//     it('should raise request started and ended event on success', fakeAsync(() => {
//       //@ts-ignore
//       spyOn(httpNotifications, 'fireRequestStarted');
//       //@ts-ignore
//       spyOn(httpNotifications, 'fireRequestEnded');
//       http.get('/someurl');
//       tick();

//       //   httpBackend.whenGET('/someurl').respond({});

//       //   testHttpService.performNormalHttpRequest().then(() => {});

//       //   httpBackend.flush();
//       expect(httpNotifications.fireRequestStarted).toHaveBeenCalled();
//       expect(httpNotifications.fireRequestEnded).toHaveBeenCalled();
//     }));

//     // it('should raise request started and ended event on error', () => {
//     //   spyOn(httpNotifications, 'fireRequestStarted');
//     //   spyOn(httpNotifications, 'fireRequestEnded');
//     //   httpBackend.whenGET('/someurl').respond(500);

//     //   testHttpService.performNormalHttpRequest().catch(() => {});

//     //   httpBackend.flush();
//     //   expect(httpNotifications.fireRequestStarted).toHaveBeenCalled();
//     //   expect(httpNotifications.fireRequestEnded).toHaveBeenCalled();
//     // });

//     // it('should raise request started and ended event on POST requests', () => {
//     //   spyOn(httpNotifications, 'fireRequestStarted');
//     //   spyOn(httpNotifications, 'fireRequestEnded');
//     //   httpBackend.whenPOST('/someurl').respond(200, {});

//     //   testHttpService.performPostHttpRequest().then(() => {});

//     //   httpBackend.flush();
//     //   expect(httpNotifications.fireRequestStarted).toHaveBeenCalled();
//     //   expect(httpNotifications.fireRequestEnded).toHaveBeenCalled();
//     // });
//   });
// });
