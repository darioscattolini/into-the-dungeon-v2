import { Injectable, EventEmitter } from '@angular/core';
import { HeroesService } from './heroes.service';
import { MonstersService } from './monsters.service';
import { 
  Player, PlayerRequirements, PlayersRequest, MonsterType, BiddingEndReason,
  BidParticipationRequestData, BidParticipationRequest, BiddingStateViewData,
  Hero, HeroChoiceRequest, EquipmentName, WeaponName, ChosenWeapon
} from '../../models/models';

@Injectable()
export class UiMediatorService {
  public readonly bidParticipationRequest 
    = new EventEmitter<BidParticipationRequest>();
  public readonly heroChoiceRequest = new EventEmitter<HeroChoiceRequest>();
  public readonly playersRequest = new EventEmitter<PlayersRequest>();

  constructor(
    private heroesService: HeroesService,
    private monstersService: MonstersService
  ) { }

  public notifyBiddingResult(raider: Player, reason: BiddingEndReason): void {
    //
  }

  public notifyForcibleMonsterAddition(
    player: Player, monster: MonsterType
  ): void {
    //
  }

  public async requestBidParticipation(
    requestData: BidParticipationRequestData
  ): Promise<boolean> {
    const { player, state } = requestData;
    
    const heroViewData = this.heroesService.getPlayingHeroViewData(state.hero);
    const dungeonViewData = state.dungeon
      .map(monster => this.monstersService.getViewDataFor(monster));
    const stateViewData: BiddingStateViewData = {
      dungeon: dungeonViewData,
      hero: heroViewData, 
      remainingMonsters: state.remainingMonsters,
      remainingPlayers: state.remainingPlayers
    }

    const request = new BidParticipationRequest(player.name, stateViewData);
    this.bidParticipationRequest.emit(request) ;
    const response = await request.promise;
    
    return response;
  }

  public async requestEquipmentRemoval(
    player: Player, options: EquipmentName[]
  ): Promise<EquipmentName> {
    // minimum required implementation
    return 'chaperone';
  }

  public async requestHeroChoice(player: Player): Promise<Hero> {
    const options = this.heroesService.getHeroOptions();
    const request = new HeroChoiceRequest(player.name, options);
    this.heroChoiceRequest.emit(request) ;
    const choice = await request.promise;
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
    const request = new PlayersRequest([range.min, range.max]);
    this.playersRequest.emit(request);
    const playerNames = await request.promise;
    const players = playerNames.map(name => new Player(name));
    
    return players;
  }

  public async requestWeaponChoice(
    player: Player, options: WeaponName[]
  ): Promise<ChosenWeapon> {
    // minimum required implementation
    return 'katana';
  }
}
