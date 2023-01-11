import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, SharedModule],
  exports: [HeaderComponent], // Exporting allows other modules to use HeaderComponent when importing HeaderModule
})
export class HeaderModule {}
