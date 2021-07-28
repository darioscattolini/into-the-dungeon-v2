import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OneDeviceRoutingModule } from './one-device-routing.module';
import { OneDeviceComponent } from './one-device.component';


@NgModule({
  declarations: [OneDeviceComponent],
  imports: [
    CommonModule,
    OneDeviceRoutingModule
  ]
})
export class OneDeviceModule { }
