import { MonsterType } from './monster-type';
import { InjectionToken } from '@angular/core';
import { fairy } from './data/fairy';
import { goblin } from './data/goblin';
import { skeleton } from './data/skeleton';
import { orc } from './data/orc';
import { vampire } from './data/vampire';
import { golem } from './data/golem';
import { litch } from './data/litch';
import { demon } from './data/demon';
import { dragon } from './data/dragon';

export type MonsterData = {
  readonly damage: number;
  readonly maxAmount: number;
};

export type MonsterDataMap = { readonly [key in MonsterType]: MonsterData };

export const MonsterDataMapIT 
  = new InjectionToken<MonsterDataMap>('monsterDataMap');

export const monsterDataMap: MonsterDataMap = {
  fairy, goblin, skeleton, orc, vampire, golem, litch, demon, dragon
} as const;
