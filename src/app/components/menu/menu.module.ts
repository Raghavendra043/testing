import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu/menu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [MenuComponent],
  imports: [CommonModule, MenuRoutingModule, SharedModule, HeaderModule],
})
export class MenuModule {}
