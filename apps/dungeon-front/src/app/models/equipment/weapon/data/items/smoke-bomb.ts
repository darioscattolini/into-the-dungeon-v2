import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const smokeBomb: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: 2,
  effects: {
    goblin: () => 0,
    skeleton: () => 0,
    orc: () => 0,
    vampire: () => 0,
    golem: () => 0,
    litch: () => 0,
    demon: () => 0,
    dragon: () => 0
  }
} as const;
