import { MonsterType } from './monster-type';

export class Monster {
  public readonly type: MonsterType;
  public readonly damage: number;

  constructor(type: MonsterType, damage: number) {
    this.type = type;
    this.damage = damage;
  }
}
