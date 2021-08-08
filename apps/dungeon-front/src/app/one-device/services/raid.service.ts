import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { RaidParticipants, RaidResult } from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class RaidService {
  public async playRaid(participants: RaidParticipants): Promise<RaidResult> {
    // minimum required implementation
    const raider = participants.raider;
    const survived = true;

    return { raider, survived };
  }
}
