import { Player } from '../player/player';

export class BiddingPlayersRound {
  constructor(activePlayers: Player[]) {
    //
  }

  public get starter() { 
    // minimum required implementation
    // should return players[0]
    return new Player('player');
  }
}
