import { BiddingPlayersRound } from './bidding-players-round';
import { 
  Player, PlayerRequirements, RaidResult 
} from '../models';

// Provisional in case some sort of round notification is needed
type RoundResult = Record<string, never>;

export class Game {
  public get winner() { return this._winner; }
  private _winner?: Player;

  constructor(players: Player[]) {
    //
  }

  public static getPlayerRequirements(): PlayerRequirements {
    // minimum required implementation
    return {
      min: 1,
      max: 2
    }
  }

  public endRound(raidResult: RaidResult): RoundResult {
    // minimum required implementation
    return {};
  }

  public getBiddingPlayersRound(): BiddingPlayersRound {
    // minimum required implementation
    return new BiddingPlayersRound();
  }

  public goesOn(): boolean {
    // minimum required implementation
    return true;
  }
}
