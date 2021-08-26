import { Hero, AnyMonster, Player } from '../../models';

export interface RaidParticipants {
  raider: Player;
  hero: Hero;
  enemies: AnyMonster[];
}
