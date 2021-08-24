import { MonsterType } from './monster-type';

export class Monster<T extends MonsterType> {
  public readonly type: T;
  public readonly damage: number;

  constructor(type: T, damage: number) {
    if (damage < 0) throw new Error('Damage value must be 0 or positive.');
    this.type = type;
    this.damage = damage;
  }
}

export type AnyMonster = Monster<MonsterType>;
