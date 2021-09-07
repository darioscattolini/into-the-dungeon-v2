import { Player } from '../../models';

interface TrackedPlayer {
  player: Player, 
  stillBidding: boolean
}

export class BiddingPlayersRound {
  public get remainingPlayersAmount(): number {
    return this.players.filter(player => player.stillBidding).length;
  }

  private currentPlayer: number;
  private players: TrackedPlayer[];

  constructor(activePlayers: Player[], starterIndex: number) {
    if (starterIndex >= activePlayers.length) {
      throw new Error('starterIndex must be within activePlayers index range.');
    }

    this.players = activePlayers.map(player => {
      return { player, stillBidding: true };
    });
    this.currentPlayer = starterIndex;
  }

  public advanceToNextPlayer(): void {
    this.validateActiveCalls();

    do {
      this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    } while (!this.players[this.currentPlayer].stillBidding);
  }

  public currentPlayerWithdraws(): void {
    this.validateActiveCalls();

    this.players[this.currentPlayer].stillBidding = false;
  }

  public getCurrentPlayer(): Player {
    this.validateActiveCalls();

    return this.players[this.currentPlayer].player;
  }

  public getLastBiddingPlayer(): Player {
    if (this.remainingPlayersAmount > 1) {
      throw new Error('More than 1 player left. Bidding is still active.');
    }

    const lastTrackedPlayer = this.players
      .find(player => player.stillBidding) as TrackedPlayer;

    return lastTrackedPlayer.player;
  }

  private validateActiveCalls(): void {
    const error = 'Bidding phase has ended. Method should not have been called.';
    
    if (this.remainingPlayersAmount <= 1) throw new Error(error);
  }
}
