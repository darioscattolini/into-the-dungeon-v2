import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const dancingSword: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: 2,
  effects: {
    goblin: () => 0,
    orc: () => 0,
    golem: () => 0,
    dragon: () => 0
  }
} as const;
