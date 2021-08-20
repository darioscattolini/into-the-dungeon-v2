import { Player } from '../../models';

export class BiddingPlayersRound {
  public get remainingPlayersAmount(): number {
    return this.players.length;
  }

  private active = true;
  private currentPlayer: number;
  private players: Player[];

  constructor(activePlayers: Player[], starterIndex: number) {
    if (starterIndex >= activePlayers.length) {
      throw new Error('starterIndex must be within activePlayers index range.');
    }

    this.players = Array.from(activePlayers);
    this.currentPlayer = starterIndex;
  }

  public advanceToNextPlayer(): Player {
    this.validateActiveCalls();

    const nextPlayer = (this.currentPlayer + 1) % this.players.length;
    this.currentPlayer = nextPlayer;

    return this.getCurrentPlayer();
  }

  public currentPlayerWithdraws(): void {
    this.validateActiveCalls();

    this.players.splice(this.currentPlayer, 1);

    if (this.players.length === 1) {
      this.currentPlayer = 0;
      this.active = false;
    }

    if (this.currentPlayer === this.players.length) this.currentPlayer = 0;
  }

  public declareCurrentPlayerRaider(): void {
    this.validateActiveCalls();
    this.players = [this.getCurrentPlayer()];
    this.currentPlayer = 0;
    this.active = false;
  }

  public getCurrentPlayer(): Player {
    this.validateActiveCalls();

    return this.players[this.currentPlayer];
  }

  public getRaider(): Player {
    if (this.active) {
      throw new Error(
        'Bidding phase still active. Method should not have been called.'
      );
    }

    if (this.players.length > 1) {
      throw new Error('More than 1 player left. Bidding should be active.');
    }

    const [raider] = this.players;

    return raider;
  }

  private validateActiveCalls(): void {
    const error = 'Bidding phase has ended. Method should not have been called.';
    
    if (!this.active) throw new Error(error);
  }
}
