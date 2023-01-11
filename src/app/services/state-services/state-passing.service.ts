import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { User } from "@app/types/user.type";

@Injectable({ providedIn: "root" })
export class StatePassingService implements CanActivate {
  readonly currentUser = new CurrentUser();
  private params = new Map<string, unknown>();

  constructor(private router: Router) {}

  canActivate() {
    // Authentication guard
    if (!this.currentUser.isValid()) {
      return this.router.createUrlTree(["/login"]);
    } else {
      return true;
    }
  }

  requestParams = {
    set: (key: string, value: unknown) => {
      this.params.set(key, value);
    },
    get: <T>(key: string) => this.params.get(key) as T | undefined,
    getAndClear: <T>(key: string) => {
      const value = this.params.get(key);
      if (!this.params.delete(key)) {
        throw new Error("Key does not exist");
      }
      return value as T;
    },
    clearParam: <T>(key: string) => {
      if (this.params.get(key)) {
        this.params.delete(key);
      }
    },
    containsKey: (key: string) => this.params.has(key),
    clear: () => this.params.clear(),
  };

  getUser() {
    const selectedPatient: any = this.requestParams.get("selectedPatient");
    return selectedPatient ? selectedPatient : this.currentUser.get()!;
  }
}

class CurrentUser {
  private user?: User;

  set(user: User) {
    this.user = user;
  }

  get() {
    return this.user;
  }

  clear() {
    delete this.user;
  }

  isValid(): boolean {
    return Boolean(this.user?.firstName && this.user.lastName);
  }
}
