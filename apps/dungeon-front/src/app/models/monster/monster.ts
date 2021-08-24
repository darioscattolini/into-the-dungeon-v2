import { MonsterType } from './monster-type';

export class Monster<T extends MonsterType> {
  public readonly type: T;
  public readonly damage: number;

  constructor(type: T, damage: number) {
    this.type = type;
    this.damage = damage;
  }
}

export type AnyMonster = Monster<MonsterType>;
