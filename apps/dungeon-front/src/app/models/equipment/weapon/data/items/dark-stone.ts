import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const darkStone: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: Infinity,
  effects: {
    goblin: () => 0,
    orc: () => 0
  }
} as const;
