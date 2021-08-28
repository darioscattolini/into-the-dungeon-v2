import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const dragonCollar: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: 1,
  effects: {
    dragon: () => 0
  }
} as const;
