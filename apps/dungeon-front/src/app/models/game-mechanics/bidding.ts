import { BiddingPlayersRound } from "./bidding-players-round";
import { 
  BiddingActionRequest, BiddingActionResponse 
} from "./bidding-interactions";
import { RaidParticipants } from "./raid-participants";
import { Player, Hero, Monster } from "../models";
import { StateUpdate } from "../state/state-update";

export class Bidding {
  
  constructor(players: BiddingPlayersRound, hero: Hero, monsters: Monster[]) {
    //
  }

  public getActionRequest(): BiddingActionRequest {
    // minimum required implementation
    return {
      type: 'play-bidding',
      player: new Player('player')
    }
  }

  public getResult(): RaidParticipants {
    // minimum required implementation
    const raider = new Player('player');
    const hero = new Hero();
    const enemies: Monster[] = [];

    return { raider, hero, enemies };
  }

  public goesOn(): boolean {
    // minimum required implementation
    return false;
  }

  public onResponse(response: BiddingActionResponse): StateUpdate {
    // minimum required implementation
    return {};
  }
}
