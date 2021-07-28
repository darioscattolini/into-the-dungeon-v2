import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { paths } from './app-routing.paths';

const routes: Routes = [
  {
    path: paths.oneDevice, 
    loadChildren: () => import('./one-device/one-device.module')
      .then(m => m.OneDeviceModule) 
  }, { 
    path: paths.online, 
    loadChildren: () => import('./online/online.module')
      .then(m => m.OnlineModule) 
  }, {
    path: paths.home, component: HomeComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // for debugging
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
