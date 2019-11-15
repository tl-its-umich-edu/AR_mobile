import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArViewTsPageRoutingModule } from './ar-view-ts-routing.module';

import { ArViewTsPage } from './ar-view-ts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArViewTsPageRoutingModule
  ],
  declarations: [ArViewTsPage]
})
export class ArViewTsPageModule {}
