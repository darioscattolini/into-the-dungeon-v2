import { InjectionToken } from '@angular/core';
import { 
  EquipmentName, ProtectionName, WeaponName 
} from '../equipment/equipment-name';
import { Protection } from './protection';
import { Weapon } from './weapon';
import { WeaponEffects } from './weapon-effects';
import { CharmingFlute } from './special-weapon/charming-flute';
import { CoinOfLuck } from './special-weapon/coin-of-luck';
import { RoyalSceptre } from './special-weapon/royal-sceptre';

type ProtectionData = {
  readonly classToBeUsed: typeof Protection;
  readonly hitPoints: number;
}

type WeaponData = {
  readonly classToBeUsed: typeof Weapon;
  readonly availableUses: number;
  readonly effects: WeaponEffects;
}

export type EquipmentData = {
  readonly [key in EquipmentName]: key extends ProtectionName
    ? ProtectionData
    : key extends WeaponName
    ? WeaponData
    : never;
}

export const equipmentData: EquipmentData = {
  'ancient crown': {
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
  },
  'blasting spell': {
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
  },
  'broad sword': {
    classToBeUsed: Weapon,
    availableUses: Infinity,
    effects: {
      golem: damage => Math.random() >= 0.5 ? 0 : -damage,
      litch: damage => Math.random() >= 0.5 ? 0 : -damage,
      demon: damage => Math.random() >= 0.5 ? 0 : -damage,
    }
  },
  'chaperone': {
    classToBeUsed: Protection,
    hitPoints: 3
  }, 
  'charming flute': {
    classToBeUsed: CharmingFlute,
    availableUses: Infinity,
    effects: {
      goblin: () => 0
    }
  },
  'coin of luck': {
    classToBeUsed: CoinOfLuck,
    availableUses: 1,
    effects: {
      skeleton: () => 0,
      vampire: () => 0,
      litch: () => 0
    }
  },
  'dancing sword': {
    classToBeUsed: Weapon,
    availableUses: 2,
    effects: {
      goblin: () => 0,
      orc: () => 0,
      golem: () => 0,
      dragon: () => 0
    }
  },
  'dark stone': {
    classToBeUsed: Weapon,
    availableUses: Infinity,
    effects: {
      goblin: () => 0,
      orc: () => 0
    }
  },
  'dragon collar': {
    classToBeUsed: Weapon,
    availableUses: 1,
    effects: {
      dragon: () => 0
    }
  },
  'eardrum smasher': {
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
  },
  'energetic potion': {
    classToBeUsed: Protection,
    hitPoints: 5
  },
  'evil cape': {
    classToBeUsed: Protection,
    hitPoints: 3
  },
  'fancy tunic': {
    classToBeUsed: Protection,
    hitPoints: 5
  },
  'healing herbs': {
    classToBeUsed: Protection,
    hitPoints: 3
  },
  'katana': {
    classToBeUsed: Weapon,
    availableUses: Infinity,
    effects: {
      demon: () => 0,
      dragon: () => 0
    }
  },
  'ninja pack': {
    classToBeUsed: Weapon,
    availableUses: 2,
    effects: {
      goblin: () => 0,
      orc: () => 0,
      golem: () => 0
    }
  },
  'power drainer': {
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
  },
  'royal sceptre': {
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
  },
  'smoke bomb': {
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
  },
  'sophisticated hat': {
    classToBeUsed: Protection,
    hitPoints: 2
  },
  'suitor': {
    classToBeUsed: Protection,
    hitPoints: 5
  },
  'wand of blood': {
    classToBeUsed: Weapon,
    availableUses: Infinity,
    effects: {
      vampire: damage => damage
    }
  },
  'wooden shuriken': {
    classToBeUsed: Weapon,
    availableUses: Infinity,
    effects: {
      vampire: () => 0
    }
  },
  'zombie companion': {
    classToBeUsed: Protection,
    hitPoints: 6
  }
} as const;

export const EquipmentDataIT 
  = new InjectionToken<EquipmentData>('equipmentData');
