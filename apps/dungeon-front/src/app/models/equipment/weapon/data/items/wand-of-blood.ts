import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const wandOfBlood: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: Infinity,
  effects: {
    vampire: damage => damage
  }
} as const;
