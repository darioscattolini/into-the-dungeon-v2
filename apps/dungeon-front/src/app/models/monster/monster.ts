import { MonsterType } from "./monster-type";

export class Monster {
  public readonly type: MonsterType

  constructor(type: MonsterType) {
    this.type = type;
  }
}
