import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OneDeviceComponent } from './one-device.component';

const routes: Routes = [{ path: '', component: OneDeviceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OneDeviceRoutingModule { }
