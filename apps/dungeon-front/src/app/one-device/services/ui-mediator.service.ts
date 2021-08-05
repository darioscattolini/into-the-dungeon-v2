import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';

@Injectable({
  providedIn: OneDeviceModule
})
export class UiMediatorService {

  constructor() {
    //
  }

  public notifyError(error: string): void {
    //
  }

  public async requestPlayersAmount(range: [number, number]): Promise<number> {
    // minimum required implementation
    return 3;
  }

  public async requestPlayerName(): Promise<string> {
    // minimum required implementation
    return 'John';
  }
}
