import { Injectable } from '@angular/core';
import { User } from '@app/types/user.type';
import { of } from 'rxjs';

Injectable();
export class FakeGenericRestService {
  response: any;
  constructor(response: any) {
    this.response = response;
  }

  list(user?: any): any {
    return Promise.resolve(this.response);
  }

  get(user?: any): any {
    return Promise.resolve(this.response);
  }

  listTypes = (user?: any) => {
    return Promise.resolve(this.response);
  };
}

export class FakeAcknowledgementsService extends FakeGenericRestService {}

export class FakeLinkCategoriesService extends FakeGenericRestService {}

export class FakeMeasurementsService extends FakeGenericRestService {}

export class FakeMessageThreadService extends FakeGenericRestService {

}

export class FakeQuestionnairesService extends FakeGenericRestService {
  override response: any;
  resolve: any;
  constructor(response: any, resolve?: boolean) {
    super(response);
    this.response = response;
    this.resolve = resolve ? resolve : undefined;
  }

  replyTo(): any {
    if (this.resolve) {
      return Promise.resolve(this.response);
    } else {
      return Promise.reject(this.response);
    }
  }
}

export class FakeQuestionnaireSchedulesService extends FakeGenericRestService {
  override list(user?: any): any {
    return of(this.response);
  }
}

export class FakeQuestionnaireResultsService {
  showResponse: any;
  listResponse: any;
  constructor(showResponse: any, listResponse: any) {
    this.showResponse = showResponse;
    this.listResponse = listResponse;
  }

  show = () => {
    return Promise.resolve(this.showResponse);
  };

  list = (url: any) => {
    return Promise.resolve(this.listResponse);
  };
}

export class FakeClinicianService {
  isClinician = () => false;
  canActivate = () => false;
}
