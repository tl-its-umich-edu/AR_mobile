import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArBusstopsPageRoutingModule } from './ar-busstops-routing.module';

import { ArBusstopsPage } from './ar-busstops.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArBusstopsPageRoutingModule
  ],
  declarations: [ArBusstopsPage]
})
export class ArBusstopsPageModule {}
