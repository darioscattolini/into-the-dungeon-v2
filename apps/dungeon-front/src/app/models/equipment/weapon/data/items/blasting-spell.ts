import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const blastingSpell: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: 2,
  effects: {
    goblin: () => -2,
    skeleton: () => -2,
    orc: () => -2,
    vampire: () => -2,
    golem: () => -2,
    litch: () => -2,
    demon: () => -2,
    dragon: () => -2
  }
} as const;
