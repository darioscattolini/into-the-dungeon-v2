import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { UiMediatorService } from './ui-mediator.service';
import { MonstersService } from './monsters.service';
import { 
  Bidding, BiddingPlayersRound, BiddingResult,
  BiddingActionRequest as ActionRequest, BiddingActionResponse as ActionResponse,
  BidParticipationRequest, BidParticipationResponse,
  MonsterAdditionRequest, MonsterAdditionResponse,
  EquipmentRemovalRequest, EquipmentRemovalResponse,
} from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class BiddingService {

  constructor(
    private uiMediator: UiMediatorService,
    private monstersService: MonstersService
  ) { }

  public async playBidding(players: BiddingPlayersRound): Promise<BiddingResult> {
    const bidding = await this.setBiddingUp(players);
    const result = await this.manageBidding(bidding);
    
    return result;
  }

  private async makeRequest(request: ActionRequest): Promise<ActionResponse> {  
    switch (request.type) {
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
      const request = bidding.getActionRequest();
      const response = await this.makeRequest(request);
      const outcome = bidding.onResponse(response);
      // Notify state update
    }

    return bidding.getResult();
  }

  private async setBiddingUp(players: BiddingPlayersRound): Promise<Bidding> {
    // Notify who is first player
    const hero = await this.uiMediator.requestHeroChoice(players.starter);
    const monstersPack = this.monstersService.getMonstersPack();
        
    return new Bidding(players, hero, monstersPack);
  }

  private async requestBidParticipation(
    request: BidParticipationRequest
  ): Promise<BidParticipationResponse> {
    const player = request.player;

    const response = await this.uiMediator.requestBidParticipation(player);
    
    return { 
      type: request.type, 
      content: response 
    };
  }

  private async requestEquipmentRemoval(
    request: EquipmentRemovalRequest
  ): Promise<EquipmentRemovalResponse> {
    const player = request.player
    const options = request.content;
        
    const response
      = await this.uiMediator.requestEquipmentRemoval(player, options);
    
    return { 
      type: request.type, 
      content: response 
    };
  }

  private async requestMonsterAddition(
    request: MonsterAdditionRequest
  ): Promise<MonsterAdditionResponse> {
    const player = request.player;
    const monster = request.content;
    
    const response 
      = await this.uiMediator.requestMonsterAddition(player, monster);
    
    return { 
      type: request.type, 
      content: response
    };
  }
}
