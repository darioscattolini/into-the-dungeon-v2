import { Injectable } from '@angular/core';
import { UiMediatorService } from './ui-mediator.service';
import { MonstersService } from './monsters.service';
import { 
  Bidding, BiddingPlayersRound, 
  BiddingActionRequestData, BiddingActionResponseContent,
  BidParticipationRequestData, BidParticipationResponseContent,
  MonsterAdditionRequestData, MonsterAdditionResponseContent,
  EquipmentRemovalRequestData, EquipmentRemovalResponseContent,
  BiddingResult, RaidParticipants
} from '../../models/models';

@Injectable()
export class BiddingService {

  constructor(
    private uiMediator: UiMediatorService,
    private monstersService: MonstersService
  ) { }

  public async playBidding(
    players: BiddingPlayersRound
  ): Promise<RaidParticipants> {
    const bidding = await this.setBiddingUp(players);
    const result = await this.manageBidding(bidding);
    
    this.uiMediator.notifyBiddingResult(result.raider, result.endReason);

    return result;
  }

  private async makeRequest(
    request: BiddingActionRequestData
  ): Promise<BiddingActionResponseContent> {  
    switch (request.action) {
      case 'play-bidding': 
        return await this.requestBidParticipation(request);
      case 'add-monster':
        return await this.requestMonsterAddition(request);
      case 'remove-equipment': 
        return await this.requestEquipmentRemoval(request);
      default:
        throw new Error('Unexpected request parameter');
    };
  }

  private async manageBidding(bidding: Bidding): Promise<BiddingResult> {
    while (bidding.goesOn()) {
      const request = bidding.getActionRequestData();
      const response = await this.makeRequest(request);
      const outcome = bidding.onResponse(response);
      
      if (outcome.notification) {
        this.uiMediator.notifyForcibleMonsterAddition(outcome.notification);
        // wait for it to be confirmed
      }
    }

    return bidding.getResult();
  }

  private async setBiddingUp(players: BiddingPlayersRound): Promise<Bidding> {
    const starter = players.getCurrentPlayer();
    const hero = await this.uiMediator.requestHeroChoice(starter);
    const monstersPack = this.monstersService.getMonstersPack();
        
    return new Bidding(players, hero, monstersPack);
  }

  private async requestBidParticipation(
    request: BidParticipationRequestData
  ): Promise<BidParticipationResponseContent> {
    const response = await this.uiMediator.requestBidParticipation(request);
    
    return { 
      action: request.action, 
      content: response 
    };
  }

  private async requestEquipmentRemoval(
    request: EquipmentRemovalRequestData
  ): Promise<EquipmentRemovalResponseContent> {
    const player = request.player
    const options = request.content;
        
    const response
      = await this.uiMediator.requestEquipmentRemoval(player, options);
    
    if (!options.includes(response)) {
      throw new Error('Chosen equipment not included among eligible options');
    }

    return { 
      action: request.action, 
      content: response 
    };
  }

  private async requestMonsterAddition(
    request: MonsterAdditionRequestData
  ): Promise<MonsterAdditionResponseContent> {
    const player = request.player;
    const monster = request.content;
    
    const response 
      = await this.uiMediator.requestMonsterAddition(player, monster);
    
    return { 
      action: request.action, 
      content: response
    };
  }
}
