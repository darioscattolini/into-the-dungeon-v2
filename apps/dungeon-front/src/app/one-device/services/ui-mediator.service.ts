import { Injectable } from '@angular/core';
import { EquipmentService } from './equipment.service';
import { HeroesService } from './heroes.service';
import { MonstersService } from './monsters.service';
import {
  BiddingEndNotification,
  BiddingEndReason,
  BiddingState,
  BiddingStateViewData,
  BidParticipationRequest,
  ChosenWeapon,
  Encounter,
  EncounterOutcome,
  EncounterResolutionRequest,
  EquipmentName,
  EquipmentRemovalRequest,
  ForcibleMonsterAdditionNotification, 
  Hero,
  HeroChoiceRequest,
  MonsterAdditionRequest,
  MonsterType,
  Player,
  PlayersRequest,
  PlayerRequirements,
  Request,
  EncounterOutcomeNotification
} from '../../models/models';
import { Subject } from 'rxjs';
import { RaidState } from '../../models/game-mechanics/raid/raid-state';

@Injectable()
export class UiMediatorService {
  public readonly biddingEndNotification 
    = new Subject<BiddingEndNotification>();

  public readonly bidParticipationRequest 
    = new Subject<BidParticipationRequest>();

  public readonly encounterOutcomeNotification
    = new Subject<EncounterOutcomeNotification>();

  public readonly encounterResolutionRequest
    = new Subject<EncounterResolutionRequest>();

  public readonly equipmentRemovalRequest
    = new Subject<EquipmentRemovalRequest>();

  public readonly forcibleMonsterAdditionNotification 
    = new Subject<ForcibleMonsterAdditionNotification>();

  public readonly heroChoiceRequest 
    = new Subject<HeroChoiceRequest>();
  
  public readonly monsterAdditionRequest
    = new Subject<MonsterAdditionRequest>();

  public readonly playersRequest 
    = new Subject<PlayersRequest>();

  constructor(
    private equipmentService: EquipmentService,
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

    await this.requestResponse(content, this.biddingEndNotification);
  }

  public async notifyEncounterOutcome(
    raider: Player, outcome: EncounterOutcome
  ): Promise<void> {
    const content: EncounterOutcomeNotification['content'] = {
      player: raider.name,
      ...outcome
    };

    await this.requestResponse(content, this.encounterOutcomeNotification);
  }

  public async notifyForcibleMonsterAddition(
    player: Player, monster: MonsterType
  ): Promise<void> {
    const content: ForcibleMonsterAdditionNotification['content'] = {
      player: player.name,
      monster: this.monstersService.getViewDataFor(monster)
    };

    await this.requestResponse(content, this.forcibleMonsterAdditionNotification);
  }

  public async requestBidParticipation(
    player: Player, state: BiddingState
  ): Promise<boolean> {   
    const content: BidParticipationRequest['content'] = {
      player: player.name,
      state: this.getBiddingStateViewDataFor(state)
    };

    const response 
      = await this.requestResponse(content, this.bidParticipationRequest);
    
    return response;
  }

  public async requestEncounterResolution(
    raider: Player,
    encounter: Encounter, 
    state: RaidState
  ): Promise<ChosenWeapon> {
    const player = raider.name;
    const enemy = this.monstersService.getViewDataFor(encounter.enemy);
    const weapons = encounter.weapons
      .map(weapon => this.equipmentService.getViewDataFor(weapon));
    const hero = this.heroesService.getPlayingHeroViewData(state.hero);
    const remainingEnemies = state.remainingEnemies;
    
    const content: EncounterResolutionRequest['content'] = {
      player,
      encounter: { enemy, weapons },
      state: { hero, remainingEnemies }
    };

    const chosenPiece 
      = await this.requestResponse(content, this.encounterResolutionRequest);

    return chosenPiece;
  }

  public async requestEquipmentRemoval(
    player: Player, state: BiddingState
  ): Promise<EquipmentName> {
    const stateViewData = this.getBiddingStateViewDataFor(state);

    const content: EquipmentRemovalRequest['content'] = {
      player: player.name,
      state: stateViewData
    };

    const response 
      = await this.requestResponse(content, this.equipmentRemovalRequest);
    
    return response;
  }

  public async requestHeroChoice(player: Player): Promise<Hero> {
    const content: HeroChoiceRequest['content'] = {
      player: player.name,
      options: this.heroesService.getHeroOptions()
    };

    const choice = await this.requestResponse(content, this.heroChoiceRequest);
    
    const hero = this.heroesService.createHero(choice);

    return hero;
  }

  public async requestMonsterAddition(
    player: Player, 
    monster: MonsterType, 
    state: BiddingState
  ): Promise<boolean> {
    const content: MonsterAdditionRequest['content'] = {
      player: player.name,
      monster: this.monstersService.getViewDataFor(monster),
      state: this.getBiddingStateViewDataFor(state)
    };

    const response 
      = await this.requestResponse(content, this.monsterAdditionRequest);
    
    return response;
  }

  public async requestPlayers(range: PlayerRequirements): Promise<Player[]> {
    const content: PlayersRequest['content'] = {
      range: [range.min, range.max]
    };
    
    const playerNames = await this.requestResponse(content, this.playersRequest);

    const players = playerNames.map(name => new Player(name));
    
    return players;
  }

  private getBiddingStateViewDataFor(state: BiddingState): BiddingStateViewData {
    const heroViewData = this.heroesService.getPlayingHeroViewData(state.hero);
    const dungeonViewData = state.dungeon
      .map(monster => this.monstersService.getViewDataFor(monster));
    
    return {
      dungeon: dungeonViewData,
      hero: heroViewData, 
      remainingMonsters: state.remainingMonsters,
      remainingPlayers: state.remainingPlayers
    };
  }

  private requestResponse<Response, Content>(
    content: Content,
    emitter: Subject<Request<Response, Content>>
  ): Promise<Response> {
    return new Promise<Response>(resolve => {
      const request: Request<Response, Content> = { resolve, content };

      emitter.next(request);
    });
  }
}
