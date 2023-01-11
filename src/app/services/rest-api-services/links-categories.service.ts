import { Injectable } from '@angular/core';
import { User } from 'src/app/types/user.type';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LinksCategoriesService {
  constructor(private http: HttpClient) {}

  list = (user: User): Promise<any[]> => {
    if (
      !user.hasOwnProperty('links') ||
      !user.links.hasOwnProperty('linksCategories')
    ) {
      throw new TypeError(
        'User object does not contain a link relation to my links categories'
      );
    }

    const url = user.links.linksCategories;
    return lastValueFrom(this.http.get<any[]>(url));
  };

  get = (linksCategoryRef: any) => {
    if (
      !linksCategoryRef.hasOwnProperty('links') ||
      !linksCategoryRef.links.hasOwnProperty('linksCategory')
    ) {
      throw new TypeError(
        'Links category ref does not contain a link relation to category links'
      );
    }

    const url = linksCategoryRef.links.linksCategory;
    return lastValueFrom(this.http.get(url));
  };
}
