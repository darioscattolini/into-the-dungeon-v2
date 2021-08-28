import { HeroType } from './hero-type';
import { AnyEquipmentViewData } from '../models';
import { InjectionToken } from '@angular/core';
import { bard } from './view-data/bard';
import { mage } from './view-data/mage';
import { ninja } from './view-data/ninja';
import { princess } from './view-data/princess';

export interface HeroViewData<T extends HeroType> {
  readonly type: T;
  readonly image: string;
  readonly description: string;
  readonly equipment: ReadonlyArray<AnyEquipmentViewData>
}

export type PartialHeroViewData<T extends HeroType> 
  = Omit<HeroViewData<T>, 'equipment'>;

export type AnyHeroViewData = HeroViewData<HeroType>;

export type HeroViewDataMap = {
  readonly [key in HeroType]: PartialHeroViewData<key>;
};

export const HeroViewDataMapIT
  = new InjectionToken<HeroViewDataMap>('heroViewDataMap');

export const heroViewDataMap: HeroViewDataMap = {
  bard, mage, ninja, princess
} as const;
