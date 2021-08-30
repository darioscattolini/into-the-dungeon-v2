import { NgModule } from '@angular/core';
import { oneDeviceModuleDeclarations } from './one-device-declarations';
import { oneDeviceModuleImports } from './one-device-imports';
import { oneDeviceModuleProviders } from './one-device-providers';

@NgModule({
  declarations: oneDeviceModuleDeclarations,
  imports: oneDeviceModuleImports,
  providers: oneDeviceModuleProviders
})
export class OneDeviceModule { }
