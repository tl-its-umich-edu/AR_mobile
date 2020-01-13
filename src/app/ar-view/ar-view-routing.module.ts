import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArViewPage } from './ar-view.page';

const routes: Routes = [
  {
    path: '',
    component: ArViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArViewPageRoutingModule {}
