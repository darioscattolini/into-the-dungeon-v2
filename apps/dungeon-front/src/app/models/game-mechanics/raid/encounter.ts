import { MonsterType, WeaponName } from '../../models';

export interface Encounter {
  enemy: MonsterType;
  weapons: WeaponName[];
}

export type ChosenWeapon = WeaponName | 'NO_WEAPON';

export interface EncounterOutcome {
  hitPointsChange: number,
  discardedWeapon?: WeaponName
}
