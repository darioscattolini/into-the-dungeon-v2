import { MonsterType } from './monster-type';

type MonsterData = {
  readonly [key in MonsterType]: {
    readonly damage: number;
    readonly maxAmount: number;
  }
};

export const monsterData: MonsterData = {
  fairy: {
    damage: 0,
    maxAmount: 2
  },
  goblin: {
    damage: 1,
    maxAmount: 2
  },
  skeleton: {
    damage: 2,
    maxAmount: 2
  },
  orc: {
    damage: 3,
    maxAmount: 2
  },
  vampire: {
    damage: 4,
    maxAmount: 2
  },
  golem: {
    damage: 5,
    maxAmount: 2
  },
  litch: {
    damage: 6,
    maxAmount: 1
  },
  demon: {
    damage: 7,
    maxAmount: 1
  },
  dragon: {
    damage: 9,
    maxAmount: 1
  }
} as const;
