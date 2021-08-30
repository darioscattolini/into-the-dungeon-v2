import { Injectable } from '@angular/core';
import { HeroesService } from './heroes.service';
import { 
  Player, PlayerRequirements, PlayersRequest, MonsterType, 
  Hero, HeroType, EquipmentName, WeaponName, ChosenWeapon,
} from '../../models/models';



@Injectable()
export class UiMediatorService {
  public get playersRequest() { return this._playersRequest; }
  private _playersRequest?: PlayersRequest;

  constructor(private heroesService: HeroesService) { }

  public notifyError(error: string): void {
    //
  }

  public async requestBidParticipation(player: Player): Promise<boolean> {
    // minimum required implementation
    return false;
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

  public async requestPlayers(range: PlayerRequirements): Promise<Player[]> {
    this._playersRequest = new PlayersRequest([range.min, range.max]);
    const response = await this._playersRequest.promise;
    this._playersRequest = undefined;
    const players = response.map(name => new Player(name));
    
    return players;
  }

  public async requestWeaponChoice(
    player: Player, options: WeaponName[]
  ): Promise<ChosenWeapon> {
    // minimum required implementation
    return 'katana';
  }
}
