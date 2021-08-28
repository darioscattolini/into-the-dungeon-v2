import { MonsterType } from './monster-type';
import { InjectionToken } from '@angular/core';
import { fairy } from './view-data/fairy';
import { goblin } from './view-data/goblin';
import { skeleton } from './view-data/skeleton';
import { orc } from './view-data/orc';
import { vampire } from './view-data/vampire';
import { golem } from './view-data/golem';
import { litch } from './view-data/litch';
import { demon } from './view-data/demon';
import { dragon } from './view-data/dragon';

export interface MonsterViewData<T extends MonsterType> {
  readonly name: T;
  readonly damage: number;
  readonly image: string;
  readonly description: string;
}

export type MonsterViewDataMap = {
  readonly [key in MonsterType]: MonsterViewData<key>;
};

export const MonsterViewDataMapIT
  = new InjectionToken<MonsterViewDataMap>('monsterViewDataMap');

export const monsterViewDataMap: MonsterViewDataMap = {
  fairy, goblin, skeleton, orc, vampire, golem, litch, demon, dragon
} as const;
