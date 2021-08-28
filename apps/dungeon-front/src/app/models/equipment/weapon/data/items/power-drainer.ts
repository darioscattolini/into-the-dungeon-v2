import { WeaponData } from '../weapon-data';
import { Weapon } from '../../weapon';

export const powerDrainer: WeaponData = {
  classToBeUsed: Weapon,
  availableUses: 2,
  effects: {
    goblin: damage => Math.floor(-damage / 2),
    skeleton: damage => Math.floor(-damage / 2),
    orc: damage => Math.floor(-damage / 2),
    vampire: damage => Math.floor(-damage / 2),
    golem: damage => Math.floor(-damage / 2),
    litch: damage => Math.floor(-damage / 2),
    demon: damage => Math.floor(-damage / 2),
    dragon: damage => Math.floor(-damage / 2)
  }
} as const;
