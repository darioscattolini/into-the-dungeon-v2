import { InjectionToken } from '@angular/core';
import { EquipmentName } from '../equipment/equipment-name';
import { HeroType } from './hero-type';
import { bard } from './data/bard';
import { mage } from './data/mage';
import { ninja } from './data/ninja';
import { princess } from './data/princess';

export type HeroData = {
  readonly hitPoints: number;
  readonly equipment: ReadonlyArray<EquipmentName>;
}

export type HeroDataMap = { readonly [key in HeroType]: HeroData; };

export const heroDataMap: HeroDataMap = { bard, mage, ninja, princess } as const;

export const HeroDataMapIT = new InjectionToken<HeroDataMap>('heroDataMap');
