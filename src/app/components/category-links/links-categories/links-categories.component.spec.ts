import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LinksCategoriesService } from 'src/app/services/rest-api-services/links-categories.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { Location } from '@angular/common';

import { LinksCategoriesComponent } from './links-categories.component';
import { CategoryLinksComponent } from '../category-links/category-links.component';
import { HeaderModule } from '../../header/header.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingModule } from '../../loading/loading.module';
import { validUser } from '@app/mocks/user.mock';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ConfigService } from '@services/state-services/config.service';
import { FakeConfigService } from '@app/mocks/config-service.mock';

const categoryIdx = 1;
const restServiceResult = {
  total: 2,
  max: 100,
  offset: 0,
  results: [
    {
      name: 'Information',
      resources: [
        {
          title: 'OpenTele user manual',
          url: 'http://www.opentelehealth.com/devices/',
          icon: 'far fa-globe',
        },
        {
          title: 'Saturation measurement guide',
          url: 'http://www.opentelehealth.com',
          icon: 'far fa-globe',
        },
      ],
      patientGroups: ['http://localhost:8080/clinician/api/patientgroups/2'],
      links: {
        category: 'http://localhost/guidance/categories/1',
      },
    },
    {
      name: 'Video instructions',
      resources: [
        {
          title: 'Demonstration of saturation measurement',
          url: 'http://opentele.silverbullet.dk/devices',
          icon: 'far fa-globe',
        },
      ],
      patientGroups: [
        'http://localhost:8080/clinician/api/patientgroups/1',
        'http://localhost:8080/clinician/api/patientgroups/4',
      ],
      links: {
        category: 'http://localhost/guidance/categories/2',
      },
    },
  ],
  links: {
    self: 'http://localhost/guidance/categories',
  },
};

const newRestServiceResult = {
  total: 1,
  max: 100,
  offset: 0,
  results: [
    {
      name: 'Information',
      resources: [
        {
          title: 'OpenTele user manual',
          url: 'http://www.opentelehealth.com/devices/',
          icon: 'far fa-globe',
        },
        {
          title: 'Saturation measurement guide',
          url: 'http://www.opentelehealth.com',
          icon: 'far fa-globe',
        },
      ],
      patientGroups: ['http://localhost:8080/clinician/api/patientgroups/2'],
      links: {
        category: 'http://localhost/guidance/categories/1',
      },
    },
  ],
  links: {
    self: 'http://localhost/guidance/categories',
  },
};

describe('LinksCategoriesComponent', () => {
  let component: LinksCategoriesComponent;
  let fixture: ComponentFixture<LinksCategoriesComponent>;
  let appContext: StatePassingService;

  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let router: Router;
  let location: Location;

  async function init(option: string) {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    if (option === 'lengthIsOne') {
      //@ts-ignore
      httpClientSpy.get.and.callFake((url: any) => {
        return of(newRestServiceResult);
      });
    } else {
      //@ts-ignore
      httpClientSpy.get.and.callFake((url: any) => {
        return of(restServiceResult);
      });
    }
    await TestBed.configureTestingModule({
      declarations: [LinksCategoriesComponent, CategoryLinksComponent],
      providers: [
        { provide: ConfigService, useClass: FakeConfigService },
        {
          provide: StatePassingService,
          useValue: new StatePassingService(router),
        },
        { provide: HttpClient, useValue: httpClientSpy },
        {
          provide: LinksCategoriesService,
          useValue: new LinksCategoriesService(httpClientSpy),
        },
      ],
      imports: [
        HeaderModule,
        TranslateModule.forRoot(),
        LoadingModule,
        RouterTestingModule.withRoutes(
          //   routes //TODO: Should ideally be imported but relative path can't match
          [
            {
              path: 'links_categories',
              component: LinksCategoriesComponent,
            },
            {
              path: 'links_categories/:id/category_links',
              component: CategoryLinksComponent,
            },
          ]
        ),
      ],
    }).compileComponents();
  }

  describe('when rest response contains multiple results the component', () => {
    beforeEach(async () => {
      await init('lengthIsNotOne');
    });

    beforeEach(() => {
      router = TestBed.get(Router);
      router.initialNavigation();
      location = TestBed.get(Location);
      appContext = TestBed.get(StatePassingService);
      appContext.currentUser.set(validUser);
      fixture = TestBed.createComponent(LinksCategoriesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should get all categories for user', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.model.categories).toEqual(restServiceResult.results);
    });

    it('should open category when clicked', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      component.showCategory(categoryIdx);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(location.path()).toEqual('/links_categories/1/category_links');
      expect(appContext.requestParams.getAndClear('selectedCategory')).toEqual(
        restServiceResult.results[categoryIdx]
      );
    });
  });

  describe('when rest response contains one result the component', () => {
    beforeEach(async () => {
      await init('lengthIsOne');
    });
    beforeEach(() => {
      router = TestBed.get(Router);
      location = TestBed.get(Location);
      appContext = TestBed.get(StatePassingService);
      appContext.currentUser.set(validUser);
      fixture = TestBed.createComponent(LinksCategoriesComponent);
      component = fixture.componentInstance;
      router.initialNavigation();
      fixture.detectChanges();
    });

    it('should automatically redirect to specific category if list only contains one', async () => {
      const navigateSpy = spyOn(router, 'navigate');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(navigateSpy).toHaveBeenCalledWith(
        ['links_categories/0/category_links'],
        { replaceUrl: true }
      );
    });
  });
});
