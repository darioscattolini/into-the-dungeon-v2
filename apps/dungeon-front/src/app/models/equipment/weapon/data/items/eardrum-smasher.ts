import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const eardrumSmasher: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: 3,
  effects: {
    goblin: () => Math.random() >= 0.4 ? -1 : -2,
    skeleton: () => Math.random() >= 0.4 ? -1 : -2,
    orc: () => Math.random() >= 0.4 ? -1 : -2,
    vampire: () => Math.random() >= 0.4 ? -1 : -2,
    golem: () => Math.random() >= 0.4 ? -1 : -2,
    litch: () => Math.random() >= 0.4 ? -1 : -2,
    demon: () => Math.random() >= 0.4 ? -1 : -2,
    dragon: () => Math.random() >= 0.4 ? -1 : -2
  }
} as const;
