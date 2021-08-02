import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { PlayersService } from './players.service';
import { BiddingService } from './bidding.service';
import { RaidService } from './raid.service';
import { Game, BiddingResult } from '../../models/models';

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
    
    while(game.goesOn()) {
      const raidParticipants = await this.playBidding(game);
      const roundResult = await this.playRaid(raidParticipants, game);
      // NOTIFICATION REQUIRED?
    }

    this.declareWinner(game);
  }

  private async buildNewGame(): Promise<Game> {
    const requirements = Game.getPlayerRequirements();
    const players = await this.playersService.getJoiningPlayers(requirements);
    const game = new Game(players);
    
    return game;
  }

  private declareWinner(game: Game) {
    const winner = game.winner;
    // NOTIFY WINNER
  }

  private async playBidding(game: Game): Promise<BiddingResult> {
    const players = game.getActivePlayers();
    const starter = game.getBiddingStarter();
    const result = await this.biddingService.playBidding(players, starter);

    return result;
  }

  private async playRaid(participants: BiddingResult, game: Game) {
    const raidResult = await this.raidService.playRaid(participants);        
    const roundResult = game.endRound(raidResult);
    
    return roundResult;
  }
}

/*
  NOTIFICATION POLICY:
  Player choosing, bidding and raid events are notified by respective services
  Check if special notification is required after every round
  Implement Winner notification
*/
