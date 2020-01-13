import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'ar-view',
    loadChildren: () => import('./ar-view/ar-view.module').then( m => m.ArViewPageModule)
  },
  {
    path: 'ar-busstops',
    loadChildren: () => import('./ar-busstops/ar-busstops.module').then( m => m.ArBusstopsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
