import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { HeroesService } from './heroes.service';
import { 
  Player, Hero, HeroType, MonsterType, EquipmentName, WeaponName, ChosenWeapon
} from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class UiMediatorService {

  constructor(public heroesService: HeroesService) { }

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
    // partial implementation
    this.heroesService.getHeroOptions();
    // expect choice from player;
    const choice: HeroType = 'bard';
    const hero = this.heroesService.createHero(choice);
    
    return hero;
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
