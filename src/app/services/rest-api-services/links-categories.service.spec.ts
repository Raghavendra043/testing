import { fakeAsync, tick } from '@angular/core/testing';
import { LinksCategoriesService } from './links-categories.service';
import { HttpClient } from '@angular/common/http';
import { User } from '@app/types/user.type';
import { validUser } from '@app/mocks/user.mock';
import { of } from 'rxjs';

const response = {
  categories: [
    {
      name: 'Information',
      links: {
        linkCategory: 'http://localhost/patient/links_categories/1',
      },
    },
    {
      name: 'Video instructions',
      links: {
        linkCategory: 'http://localhost/patient/links_categories/2',
      },
    },
  ],
  links: {
    self: 'http://localhost/patient/links_categories',
  },
};

describe('LinksCategoriesService', () => {
  let service: LinksCategoriesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new LinksCategoriesService(httpClientSpy);
  });

  describe('list all links categories for user', () => {
    it('should not invoke callback when status is 401', fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(response));
      let successCallbackInvoked = false;

      const user: User = {
        ...validUser,
      };
      service
        .list(user)
        .then(() => {
          successCallbackInvoked = true;
        })
        .catch((): any => null);
      tick();
      expect(successCallbackInvoked).toBe(true);
    }));

    it('should throw exception when user has no link to linksCategories', fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(response));
      const invalidUser: User = {
        ...validUser,
        links: { ...validUser.links },
      };
      delete invalidUser.links.linksCategories;

      expect(() => {
        service.list(invalidUser);
      }).toThrow();
    }));

    it('should invoke success callback when response is valid', fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(response));
      let successCallbackInvoked = false;
      const user: User = {
        ...validUser,
      };

      service.list(user).then(() => {
        successCallbackInvoked = true;
      });
      tick();

      expect(successCallbackInvoked).toEqual(true);
    }));

    it('should transform response to client object', fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(response));

      const user: User = {
        ...validUser,
      };

      let data: any = {};
      service.list(user).then((response: any) => {
        data = response;
      });

      tick();
      const informationIndex = 0;
      const videoInstructionsIndex = 1;
      expect(data.categories.length).toEqual(2);
      expect(data.categories[informationIndex].name).toEqual('Information');
      expect(data.categories[informationIndex].links.linkCategory).toEqual(
        'http://localhost/patient/links_categories/1'
      );
      expect(data.categories[videoInstructionsIndex].name).toEqual(
        'Video instructions'
      );
      expect(
        data.categories[videoInstructionsIndex].links.linkCategory
      ).toEqual('http://localhost/patient/links_categories/2');
    }));
  });

  describe('get specific category links', () => {
    const testCategoryLinks = {
      name: 'Information',
      categoryLinks: [
        {
          title: 'OpenTele user manual',
          url: 'http://www.opentelehealth.com/devices/',
        },
        {
          title: 'Saturation measurement guide',
          url: 'http://www.opentelehealth.com/architecture/',
        },
      ],
      links: {
        self: 'http://localhost/patient/links_categories/1',
      },
    };

    it('should transform response to client object', fakeAsync(() => {
      const categoryLinksRef = {
        name: 'Information',
        links: {
          linksCategory: 'http://localhost/patient/links_categories/1',
        },
      };

      httpClientSpy.get.and.returnValue(of(testCategoryLinks));
      tick();

      let data: any = {};
      service.get(categoryLinksRef).then((response: any) => {
        data = response;
      });
      tick();

      expect(data.name).toEqual('Information');
      expect(data.categoryLinks.length).toEqual(2);

      const userManualIndex = 0;
      expect(data.categoryLinks[userManualIndex].title).toEqual(
        'OpenTele user manual'
      );
      expect(data.categoryLinks[userManualIndex].url).toEqual(
        'http://www.opentelehealth.com/devices/'
      );

      const measurementGuideIndex = 1;
      expect(data.categoryLinks[measurementGuideIndex].title).toEqual(
        'Saturation measurement guide'
      );
      expect(data.categoryLinks[measurementGuideIndex].url).toEqual(
        'http://www.opentelehealth.com/architecture/'
      );
    }));

    it('should throw exception if links is not defined', fakeAsync(() => {
      httpClientSpy.get.and.returnValue(of(testCategoryLinks));

      const wrapperEmpty = () => {
        service.get({});
      };
      const wrapperNoLink = () => {
        service.get({ links: {} });
      };
      expect(wrapperEmpty).toThrow();
      expect(wrapperNoLink).toThrow();
    }));
  });
});
