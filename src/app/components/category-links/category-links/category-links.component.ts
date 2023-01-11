import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NativeService } from 'src/app/services/native-services/native.service';
import { StatePassingService } from 'src/app/services/state-services/state-passing.service';
import { CategoryLinksModel } from 'src/app/types/model.type';

@Component({
  selector: 'app-category-links',
  templateUrl: './category-links.component.html',
  styleUrls: ['./category-links.component.less'],
})
export class CategoryLinksComponent {
  model: any = undefined;

  constructor(
    private appContext: StatePassingService,
    private router: Router,
    private native: NativeService
  ) {
    if (!this.appContext.requestParams.containsKey('selectedCategory')) {
      this.router.navigate(['/menu']);
      return;
    }

    const selectedCategory =
      this.appContext.requestParams.getAndClear('selectedCategory');
    this.model = this.initModel(selectedCategory);
    this.model.hasOtherCategories =
      this.appContext.requestParams.get('hasOtherCategories');
  }

  showPopup = (index: number) => {
    this.model.showPopup = true;
    this.model.currentLink = this.model.resources[index].url;
  };

  hidePopup = () => {
    this.model.showPopup = false;
    this.model.currentLink = undefined;
  };

  showLink = () => {
    this.native.openUrl(this.model.currentLink);
    this.hidePopup();
  };

  initModel = (category: any): CategoryLinksModel => {
    const determineResourceType = (resource: any): void => {
      if (resource.url.endsWith('.pdf')) {
        resource.icon = 'far fa-file-pdf';
      } else if (
        resource.url.endsWith('.png') ||
        resource.url.endsWith('.jpeg') ||
        resource.url.endsWith('.jpg')
      ) {
        resource.icon = 'far fa-image';
      } else if (resource.url.toLowerCase().indexOf('youtube.com') > 0) {
        resource.icon = 'far fa-camera-movie';
      } else {
        resource.icon = 'far fa-external-link-alt';
      }
    };

    const model: CategoryLinksModel = {
      name: category.name,
      resources: category.resources,
    };

    model.resources.forEach(determineResourceType);
    return model;
  };
}
