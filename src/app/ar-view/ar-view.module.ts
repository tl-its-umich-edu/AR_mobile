import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArViewPageRoutingModule } from './ar-view-routing.module';

import { ArViewPage } from './ar-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArViewPageRoutingModule
  ],
  declarations: [ArViewPage]
})
export class ArViewPageModule {}
