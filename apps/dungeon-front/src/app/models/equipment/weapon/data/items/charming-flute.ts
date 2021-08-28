import { WeaponData } from '../weapon-data';
import { CharmingFlute } from '../../charming-flute';

export const charmingFlute: WeaponData = {
  classToBeUsed: CharmingFlute,
  availableUses: Infinity,
  effects: {
    goblin: () => 0
  }
} as const;
