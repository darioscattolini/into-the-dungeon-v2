import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { 
  Player, Hero, MonsterType, EquipmentName, WeaponName, ChosenWeapon
} from '../../models/models';

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

  public async requestBidParticipation(player: Player): Promise<boolean> {
    // minimum required implementation
    return true;
  }

  public async requestEquipmentRemoval(
    player: Player, options: EquipmentName[]
  ): Promise<EquipmentName> {
    // minimum required implementation
    return 'chaperone';
  }

  public async requestHeroChoice(player: Player): Promise<Hero> {
    // minimum required implementation
    return new Hero('bard', 5);
  }

  public async requestMonsterAddition(
    player: Player, monster: MonsterType
  ): Promise<boolean> {
    // minimum required implementation
    return true;
  }

  public async requestPlayersAmount(range: [number, number]): Promise<number> {
    // minimum required implementation
    return 3;
  }

  public async requestPlayerName(): Promise<string> {
    // minimum required implementation
    return 'John';
  }

  public async requestWeaponChoice(
    player: Player, options: WeaponName[]
  ): Promise<ChosenWeapon> {
    // minimum required implementation
    return 'katana';
  }
}
