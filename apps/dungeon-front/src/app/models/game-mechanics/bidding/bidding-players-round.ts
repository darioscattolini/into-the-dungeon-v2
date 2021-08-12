import { Player } from '../../models';

export class BiddingPlayersRound {
  constructor(activePlayers: Player[], starterIndex: number) {
    // verify index is included in players
  }

  public get starter(): Player { 
    // minimum required implementation
    // should return players[0]
    return new Player('player');
  }
}
