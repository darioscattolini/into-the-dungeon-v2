import { Player } from '../../models';

export class BiddingPlayersRound {
  constructor(activePlayers: Player[], randomStarter: boolean) {
    //
  }

  public get starter() { 
    // minimum required implementation
    // should return players[0]
    return new Player('player');
  }
}
