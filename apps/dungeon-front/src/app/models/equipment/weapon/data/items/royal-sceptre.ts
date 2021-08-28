import { WeaponData } from '../weapon-data';
import { RoyalSceptre } from '../../royal-sceptre';

export const royalSceptre: WeaponData = {
  classToBeUsed: RoyalSceptre,
  availableUses: Infinity,
  effects: {
    goblin: damage => -Math.round(0.67 * damage),
    skeleton: damage => -Math.round(0.67 * damage),
    orc: damage => -Math.round(0.67 * damage),
    vampire: damage => -Math.round(0.67 * damage),
    golem: damage => -Math.round(0.67 * damage),
    litch: damage => -Math.round(0.67 * damage),
    demon: damage => -Math.round(0.67 * damage),
    dragon: damage => -Math.round(0.67 * damage)
  }
} as const;
