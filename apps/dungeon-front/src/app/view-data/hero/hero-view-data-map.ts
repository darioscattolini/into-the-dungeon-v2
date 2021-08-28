import { InjectionToken } from '@angular/core';
import { HeroType, PartialHeroViewData } from '../../models/models';
import { bard } from './heroes/bard-view-data';
import { mage } from './heroes/mage-view-data';
import { ninja } from './heroes/ninja-view-data';
import { princess } from './heroes/princess-view-data';

export type HeroViewDataMap = {
  readonly [key in HeroType]: PartialHeroViewData<key>;
};

export const heroViewDataMap: HeroViewDataMap = {
  bard, mage, ninja, princess
} as const;

export const HeroViewDataMapIT
  = new InjectionToken<HeroViewDataMap>('heroViewDataMap');
