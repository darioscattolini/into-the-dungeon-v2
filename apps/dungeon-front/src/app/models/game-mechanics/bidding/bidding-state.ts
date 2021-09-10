import {
  Hero,
  MonsterTypeSecret,
  AnyMonsterViewData,
  PlayingHeroViewData
} from '../../models';

export interface BiddingState {
  dungeon: MonsterTypeSecret[];
  hero: Hero;
  remainingMonsters: number;
  remainingPlayers: number;
}

export interface BiddingStateViewData {
  dungeon: AnyMonsterViewData[];
  hero: PlayingHeroViewData;
  remainingMonsters: number;
  remainingPlayers: number;
}
