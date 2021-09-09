import { Injectable, EventEmitter } from '@angular/core';
import { HeroesService } from './heroes.service';
import { MonstersService } from './monsters.service';
import { 
  BiddingEndNotification, BiddingEndReason, 
  ForcibleMonsterAdditionNotification, 
  BidParticipationRequest, BiddingState, 
  HeroChoiceRequest, Hero, HeroType, 
  PlayersRequest, Player, PlayerRequirements, 
  MonsterType, EquipmentName, WeaponName, ChosenWeapon, 
} from '../../models/models';

@Injectable()
export class UiMediatorService {
  public readonly biddingEndNotification 
    = new EventEmitter<BiddingEndNotification>();

  public readonly bidParticipationRequest 
    = new EventEmitter<BidParticipationRequest>();

  public readonly forcibleMonsterAdditionNotification 
    = new EventEmitter<ForcibleMonsterAdditionNotification>();

  public readonly heroChoiceRequest 
    = new EventEmitter<HeroChoiceRequest>();

  public readonly playersRequest 
    = new EventEmitter<PlayersRequest>();

  constructor(
    private heroesService: HeroesService,
    private monstersService: MonstersService
  ) { }

  public async notifyBiddingResult(
    raider: Player, endReason: BiddingEndReason
  ): Promise<void> {
    const content: BiddingEndNotification['content'] = {
      endReason,
      raider: raider.name
    };

    await new Promise(resolve => {
      const notification: BiddingEndNotification = { resolve, content };
      this.biddingEndNotification.emit(notification);
    });
  }

  public async notifyForcibleMonsterAddition(
    player: Player, monster: MonsterType
  ): Promise<void> {
    const content: ForcibleMonsterAdditionNotification['content'] = {
      player: player.name,
      monster: this.monstersService.getViewDataFor(monster)
    };

    await new Promise(resolve => {
      const notification: ForcibleMonsterAdditionNotification = { 
        resolve, content 
      };

      this.forcibleMonsterAdditionNotification.emit(notification);
    });
  }

  public async requestBidParticipation(
    player: Player, state: BiddingState
  ): Promise<boolean> {
    const heroViewData = this.heroesService.getPlayingHeroViewData(state.hero);
    const dungeonViewData = state.dungeon
      .map(monster => this.monstersService.getViewDataFor(monster));

    const content: BidParticipationRequest['content'] = {
      player: player.name,
      state: {
        dungeon: dungeonViewData,
        hero: heroViewData, 
        remainingMonsters: state.remainingMonsters,
        remainingPlayers: state.remainingPlayers
      }
    };

    const response = await new Promise<boolean>(resolve => {
      const request: BidParticipationRequest = { resolve, content };

      this.bidParticipationRequest.emit(request);
    });
    
    return response;
  }

  public async requestEquipmentRemoval(
    player: Player, options: EquipmentName[]
  ): Promise<EquipmentName> {
    // minimum required implementation
    return 'chaperone';
  }

  public async requestHeroChoice(player: Player): Promise<Hero> {
    const content: HeroChoiceRequest['content'] = {
      player: player.name,
      options: this.heroesService.getHeroOptions()
    };

    const choice = await new Promise<HeroType>(resolve => {
      const request: HeroChoiceRequest = { resolve, content };

      this.heroChoiceRequest.emit(request);
    });
    
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
    const content: PlayersRequest['content'] = {
      range: [range.min, range.max]
    };
    
    const playerNames = await new Promise<string[]>(resolve => {
      const request: PlayersRequest = { resolve, content };

      this.playersRequest.emit(request);
    });

    const players = playerNames.map(name => new Player(name));
    
    return players;
  }

  public async requestWeaponChoice(
    player: Player, options: WeaponName[]
  ): Promise<ChosenWeapon> {
    // minimum required implementation
    return 'katana';
  }

  // Extract promise creation as private method
}
