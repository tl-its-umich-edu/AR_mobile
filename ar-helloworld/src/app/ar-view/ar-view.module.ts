import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { ArViewPageRoutingModule } from './ar-view-routing.module';

import { ArViewPage } from './ar-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArViewPageRoutingModule
  ],
  providers: [
    AndroidPermissions
  ],
  declarations: [ArViewPage]
})
export class ArViewPageModule {}
