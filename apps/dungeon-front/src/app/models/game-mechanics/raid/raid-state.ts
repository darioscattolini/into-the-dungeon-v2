import { Hero } from '../../models';

export interface RaidState {
  hero: Hero;
  remainingEnemies: number;
}
