import { InjectionToken } from '@angular/core';
import { EquipmentName } from '../equipment/equipment-name';
import { HeroType } from './hero-type';

export type HeroData = {
  readonly [key in HeroType]: {
    readonly hitPoints: number;
    readonly equipment: ReadonlyArray<EquipmentName>;
  }
};

export const heroData: HeroData = {
  bard: {
    hitPoints: 3,
    equipment: [
      'fancy tunic',
      'sophisticated hat',
      'charming flute',
      'coin of luck',
      'dancing sword',
      'elfish harp'
    ]
  },
  mage: {
    hitPoints: 2,
    equipment: [
      'evil cape',
      'zombie companion',
      'blasting spell',
      'dark stone',
      'power drainer',
      'wand of blood'
    ]
  },
  ninja: {
    hitPoints: 3,
    equipment: [
      'energetic potion',
      'healing herbs',
      'katana',
      'ninja pack',
      'smoke bomb',
      'wooden shuriken'
    ]
  },
  princess: {
    hitPoints: 2,
    equipment: [
      'chaperone', 
      'suitor', 
      'ancient crown', 
      'broad sword', 
      'dragon collar',
      'royal sceptre'
    ]
  }
} as const;

export const HeroDataIT = new InjectionToken<HeroData>('heroData');
