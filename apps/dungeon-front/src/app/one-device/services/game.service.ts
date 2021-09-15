import { Injectable } from '@angular/core';
import { UiMediatorService } from './ui-mediator.service';
import { BiddingService } from './bidding.service';
import { RaidService } from './raid.service';
import { Game, Player } from '../../models/models';

@Injectable()
export class GameService {

  constructor(
    private uiMediator: UiMediatorService,
    private biddingService: BiddingService,
    private raidService: RaidService,
  ) { }

  public async play(): Promise<void> {
    const game = await this.buildNewGame();
    
    let winner: Player | undefined;

    while(!winner) {
      const biddingPlayers = game.getBiddingPlayersRound();
      
      const raidParticipants 
        = await this.biddingService.playBidding(biddingPlayers);
      
      const raidResult = await this.raidService.playRaid(raidParticipants);        
      
      const roundResult = game.endRound(raidResult);
      winner = roundResult.winner;
      
      await this.uiMediator.notifyRoundResult(roundResult);
    }
  }

  private async buildNewGame(): Promise<Game> {
    const requirements = Game.getPlayerRequirements();
    const players = await this.uiMediator.requestPlayers(requirements);
    const game = new Game(players);
    
    return game;
  }
}
