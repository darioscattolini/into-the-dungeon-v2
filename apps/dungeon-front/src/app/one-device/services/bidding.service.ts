import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { 
  Player, BiddingPlayersRound, BiddingResult, Hero, EquipmentPack, Monster
} from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class BiddingService {
  public async playBidding(players: BiddingPlayersRound): Promise<BiddingResult> {
    // minimum required implementation
    const raider = new Player('player');
    const hero = new Hero();
    const equipment = new EquipmentPack();
    const enemies = [new Monster(), new Monster()];

    return { raider, hero, equipment, enemies };
  }
}
