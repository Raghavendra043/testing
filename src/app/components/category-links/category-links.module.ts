import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryLinksRoutingModule } from './category-links-routing.module';
import { CategoryLinksComponent } from './category-links/category-links.component';
import { HeaderModule } from '../header/header.module';
import { LinksCategoriesComponent } from './links-categories/links-categories.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoadingModule } from '../loading/loading.module';

@NgModule({
  declarations: [CategoryLinksComponent, LinksCategoriesComponent],
  imports: [
    CommonModule,
    CategoryLinksRoutingModule,
    HeaderModule,
    SharedModule,
    LoadingModule,
  ],
})
export class CategoryLinksModule {}
