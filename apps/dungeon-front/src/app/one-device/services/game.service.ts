import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { PlayersService } from './players.service';
import { BiddingService } from './bidding.service';
import { RaidService } from './raid.service';
import { Game, Player } from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class GameService {

  constructor(
    private playersService: PlayersService,
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
      // NOTIFY PLAYER OUT OF GAME
      winner = game.getWinner();
    }
    
    // NOTIFY WINNER
  }

  private async buildNewGame(): Promise<Game> {
    const requirements = Game.getPlayerRequirements();
    const players = await this.playersService.getJoiningPlayers(requirements);
    const game = new Game(players);
    
    return game;
  }
}

/*
  NOTIFICATION POLICY:
  Player choosing, bidding and raid events are notified by respective services
  Check if special notification is required after every round
  Implement Winner notification
*/
