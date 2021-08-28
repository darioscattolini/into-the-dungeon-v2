import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const woodenShuriken: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: Infinity,
  effects: {
    vampire: () => 0
  }
} as const;
