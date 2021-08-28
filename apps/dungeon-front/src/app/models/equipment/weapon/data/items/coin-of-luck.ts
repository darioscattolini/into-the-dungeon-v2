import { WeaponData } from '../weapon-data';
import { CoinOfLuck } from '../../coin-of-luck';

export const coinOfLuck: WeaponData = {
  classToBeUsed: CoinOfLuck,
  availableUses: 1,
  effects: {
    skeleton: () => 0,
    vampire: () => 0,
    litch: () => 0
  }
} as const;
