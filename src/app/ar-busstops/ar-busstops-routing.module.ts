import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArBusstopsPage } from './ar-busstops.page';

const routes: Routes = [
  {
    path: '',
    component: ArBusstopsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArBusstopsPageRoutingModule {}
