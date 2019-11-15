import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArViewTsPage } from './ar-view-ts.page';

const routes: Routes = [
  {
    path: '',
    component: ArViewTsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArViewTsPageRoutingModule {}
