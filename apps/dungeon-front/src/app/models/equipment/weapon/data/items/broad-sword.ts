import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const broadSword: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: Infinity,
  effects: {
    golem: damage => Math.random() >= 0.5 ? 0 : -damage,
    litch: damage => Math.random() >= 0.5 ? 0 : -damage,
    demon: damage => Math.random() >= 0.5 ? 0 : -damage,
  }
} as const;
