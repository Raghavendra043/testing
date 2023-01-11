import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { Utils } from "../util-services/util.service";
import { MessageThreadsService } from "./message-threads.service";
import { HttpClient, HttpResponse, HttpEventType } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { of, throwError } from "rxjs";
import { validUser } from "@app/mocks/user.mock";
import { User } from "@app/types/user.type";

const baseUrl = "http://localhost:7000";
const user: any = {
  links: {
    threads: `${baseUrl}/chat/threads`,
  },
};

describe("MessageThreadsService", () => {
  let service: MessageThreadsService;
  let httpClient: HttpClient;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let utils: Utils;
  let httpTestingControlller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Utils, HttpClient],
    });

    httpClientSpy = jasmine.createSpyObj("HttpClient", [
      "get",
      "post",
      "put",
      "delete",
    ]);
    utils = new Utils();

    service = new MessageThreadsService(httpClientSpy, utils);
    httpTestingControlller = TestBed.inject(HttpTestingController);
  });

  describe("list all message threads for user", () => {
    it("success callback should not be invoked when status is 401", fakeAsync(() => {
      httpClientSpy.get.and.returnValue(throwError({}));
      let successCallbackInvoked = true;
      service
        .list(user, false)
        .then(
          () => {
            successCallbackInvoked = true;
          },
          () => {
            successCallbackInvoked = false;
          }
        )
        .catch((): any => undefined);
      tick();
      expect(successCallbackInvoked).toBe(false);
    }));

    it("should throw exception when user has no link to messages", () => {
      httpClientSpy.get.and.returnValue(of({}));
      const user: User = { ...validUser, links: { ...validUser.links } };
      delete user.links.threads;

      expect(() => {
        service.list(user, false).then(() => {});
      }).toThrow();
    });

    it("should invoke success callback when response is valid", fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of({}));

      let successCallbackInvoked = false;

      service.list(user, false).then(() => {
        successCallbackInvoked = true;
      });
      tick();

      expect(successCallbackInvoked).toEqual(true);
    }));
  });
});
