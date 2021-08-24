import { MonsterType } from "../models";

export type WeaponEffects = {
  [key in MonsterType]?: (damage: number) => number;
};
