import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const ancientCrown: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: Infinity,
  effects: {
    goblin: damage => -Math.max(0, damage - 2),
    skeleton: damage => -Math.max(0, damage - 2),
    orc: damage => -Math.max(0, damage - 2),
    vampire: damage => -Math.max(0, damage - 2),
    golem: damage => -Math.max(0, damage - 2),
    litch: damage => -Math.max(0, damage - 2),
    demon: damage => -Math.max(0, damage - 2),
    dragon: damage => -Math.max(0, damage - 2)
  }
} as const;
