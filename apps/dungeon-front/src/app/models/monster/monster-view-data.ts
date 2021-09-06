import { MonsterTypeSecret } from './monster-type';
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
import { secret } from './view-data/secret';

export interface MonsterViewData<T extends MonsterTypeSecret> {
  readonly name: T;
  readonly damage: T extends 'secret' ? T : number;
  readonly image: string;
  readonly description: string;
}

export type AnyMonsterViewData = MonsterViewData<MonsterTypeSecret>;

export type MonsterViewDataMap = {
  readonly [key in MonsterTypeSecret]: MonsterViewData<key>;
};

export const MonsterViewDataMapIT
  = new InjectionToken<MonsterViewDataMap>('monsterViewDataMap');

export const monsterViewDataMap: MonsterViewDataMap = {
  fairy, goblin, skeleton, orc, vampire, golem, litch, demon, dragon, secret
} as const;
