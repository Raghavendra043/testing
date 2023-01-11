import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LinksCategoriesService } from "src/app/services/rest-api-services/links-categories.service";
import { StatePassingService } from "src/app/services/state-services/state-passing.service";

@Component({
  selector: "app-links-categories",
  templateUrl: "./links-categories.component.html",
  styleUrls: ["./links-categories.component.less"],
})
export class LinksCategoriesComponent {
  model: any = {
    categories: [],
    state: "Loading",
  };

  constructor(
    private appContext: StatePassingService,
    private router: Router,
    private linksCategories: LinksCategoriesService
  ) {
    const user = this.appContext.getUser();
    if (user) {
      this.linksCategories.list(user).then(this.onSuccess).catch(this.onError);
    } else {
      console.debug("Unable to get current user");
    }
  }

  showCategory = (index: number) => {
    const linksCategory = this.model.categories[index];
    this.appContext.requestParams.set("selectedCategory", linksCategory);
    const hasOtherCategories = this.model.categories.length > 1;
    this.appContext.requestParams.set("hasOtherCategories", hasOtherCategories);

    if (this.model.categories.length === 1) {
      this.router.navigate(["links_categories/" + index + "/category_links"], {
        replaceUrl: true,
      });
    } else {
      this.router.navigate(["links_categories/" + index + "/category_links"]);
    }
  };

  onError = (data: any) => {
    this.model.state = "Failed";
    console.error(`Failed to load links categories due to error: ${data}`);
  };

  onSuccess = (data: any) => {
    this.model.categories = data.results;
    this.model.state = "Loaded";
    if (this.model.categories.length === 1) {
      const firstCategory = 0;
      this.showCategory(firstCategory);
    }
  };
}
