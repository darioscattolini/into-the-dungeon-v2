import { Player, PlayerRequirements, AddedPlayers, RaidResult } from '../models';

// Provisional in case some sort of round notification is needed
type RoundResult = Record<string, never>;

export class Game {
  public get winner() { return this._winner; }
  private _winner?: Player;

  constructor(players: AddedPlayers) {
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

  public getActivePlayers(): Player[] {
    // minimum required implementation
    return [new Player(), new Player()];
  }

  public goesOn(): boolean {
    // minimum required implementation
    return true;
  }

  public getBiddingStarter(): Player {
    // minimum required implementation
    return new Player();
  }
}
