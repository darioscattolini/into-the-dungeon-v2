import { Hero, Monster, Player } from '../../models';

export interface RaidParticipants {
  raider: Player;
  hero: Hero;
  enemies: Monster[];
}
