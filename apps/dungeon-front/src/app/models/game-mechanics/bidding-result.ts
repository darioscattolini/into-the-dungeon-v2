import { Hero, Monster, Player, EquipmentPack } from "../models";

export interface BiddingResult {
  raider: Player;
  hero: Hero;
  equipment: EquipmentPack;
  enemies: Monster[];
}
