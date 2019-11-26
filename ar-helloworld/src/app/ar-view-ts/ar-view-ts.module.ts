import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArViewTsPageRoutingModule } from './ar-view-ts-routing.module';

import { ArViewTsPage } from './ar-view-ts.page';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArViewTsPageRoutingModule
  ],
  providers: [
    AndroidPermissions
  ],
  declarations: [ArViewTsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ArViewTsPageModule {}
