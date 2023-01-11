import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { LoginComponent } from "src/app/components/login/login/login.component";
import { MenuComponent } from "src/app/components/menu/menu/menu.component";
import { StatePassingService } from "./state-passing.service";
import { validUser } from "@app/mocks/user.mock";
import { User } from "@app/types/user.type";

describe("StatePassingService", () => {
  let service: StatePassingService;
  let router: Router;

  beforeEach(() => {
    service = new StatePassingService(router);
  });

  const user: User = {
    ...validUser,
    links: { ...validUser.links },
  };

  describe("current user service", () => {
    it("should default to undefined user", () => {
      expect(service.currentUser.get()).toEqual(undefined);
    });

    it("should change current user", () => {
      service.currentUser.set(user);

      expect(service.currentUser.get()).toEqual(user);
    });

    it("should be possible to clear current user", () => {
      service.currentUser.set(user);

      service.currentUser.clear();

      expect(service.currentUser.get()).toEqual(undefined);
    });

    it("should be possible to ask if valid current user is set", () => {
      //@ts-ignore
      service.currentUser.set({});
      expect(service.currentUser.isValid()).toBe(false);

      service.currentUser.set(user);
      expect(service.currentUser.isValid()).toBe(true);
    });
  });

  describe("request parameters service", () => {
    it("should be able to set and get parameter", () => {
      service.requestParams.set("some_key", "some_value");
      expect(service.requestParams.getAndClear("some_key")).toBe("some_value");
    });

    it("should throw exception if key does not exist", () => {
      expect(() => {
        service.requestParams.getAndClear("does not exit");
      }).toThrow();
    });

    it("should clear parameter after it has been requested", () => {
      service.requestParams.set("foo", "bar");

      expect(service.requestParams.getAndClear("foo")).toBe("bar");
      expect(() => {
        service.requestParams.getAndClear("foo");
      }).toThrow();
    });

    it("should be able to check if key exist", () => {
      service.requestParams.set("someKey", "value");

      expect(service.requestParams.containsKey("someKey")).toBe(true);
      expect(service.requestParams.containsKey("someOtherKey")).toBe(false);
    });
  });
});
