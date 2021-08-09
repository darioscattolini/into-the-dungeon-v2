import { Encounter, EncounterOutcome } from './encounter';
import { Hero, Monster, ChosenWeapon } from '../models';

export class Raid {
  constructor(hero: Hero, enemies: Monster[]) {
    //
  }

  public getCurrentEncounter(): Encounter {
    // minimum required implementation
    return {
      enemy: 'demon',
      weapons: []
    };
  }

  public goesOn(): boolean {
    // minimun required implementation
    return false;
  }

  public hasHeroSurvived(): boolean {
    // minimum required implementation
    return true;
  }

  public resolveCurrentEncounter(weapon: ChosenWeapon): EncounterOutcome {
    // minimum required implementation
    return { hitPointsChange: 2 };
  }
}
