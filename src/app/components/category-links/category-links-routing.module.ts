import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryLinksComponent } from './category-links/category-links.component';
import { LinksCategoriesComponent } from './links-categories/links-categories.component';

export const routes: Routes = [
  {
    path: '',
    component: LinksCategoriesComponent,
  },
  {
    path: ':id/category_links',
    component: CategoryLinksComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryLinksRoutingModule {}
