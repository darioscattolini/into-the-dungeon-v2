import { Player } from '../../models';

export class BiddingPlayersRound {
  constructor(activePlayers: Player[], starterIndex: number) {
    // verify index is included in players
  }

  public get remainingPlayersAmount(): number {
    // minimum required implementation
    return 2;
  }

  public advanceToNextPlayer(): Player {
    // minimun required implementation
    return new Player('player');
  }

  public currentPlayerWithdraws(): void {
    // inactivates round if only 1 left
  }

  public declareCurrentPlayerRaider(): void {
    // inactivates round
  }

  public getCurrentPlayer(): Player {
    // minimum required implementation
    return new Player('player');
  }

  public getRaider(): Player {
    // minimum required implementation
    return new Player('player');
  }
}
