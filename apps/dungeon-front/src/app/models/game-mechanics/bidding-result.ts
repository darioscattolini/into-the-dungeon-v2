import { Hero, Monster, Player } from "../models";

export interface BiddingResult {
  raider: Player;
  hero: Hero;
  enemies: Monster[];
}
