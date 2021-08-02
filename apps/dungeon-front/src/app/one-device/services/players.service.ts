import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { AddedPlayers, PlayerRequirements } from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class PlayersService {
  public async getJoiningPlayers(
    required: PlayerRequirements
  ): Promise<AddedPlayers> {
    // minimum required implementation
    return new AddedPlayers();
  }
}
