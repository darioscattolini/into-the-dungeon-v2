import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const katana: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: Infinity,
  effects: {
    demon: () => 0,
    dragon: () => 0
  }
} as const;
