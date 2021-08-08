import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { Monster } from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class MonstersService {
  public getMonstersPack(): Monster[] {
    // minimum required implementation
    return [];
  }
}
