import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { Player, PlayerRequirements } from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class PlayersService {
  public async getJoiningPlayers(
    required: PlayerRequirements
  ): Promise<Player[]> {
    // minimum required implementation
    return [ new Player(), new Player()];
  }
}
