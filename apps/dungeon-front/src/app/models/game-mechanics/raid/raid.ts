import { Encounter, EncounterOutcome } from './encounter';
import { Hero, EquipmentName, AnyMonster, ChosenWeapon } from '../../models';

export class Raid {
  public get heroHitPoints(): number {
    return this.hero.hitPoints;
  }

  public get heroEquipment(): EquipmentName[] {
    return this.hero.getMountedEquipment();
  }

  public get enemiesLeft(): number {
    return this.enemies.length + (this.currentEnemy ? 1 : 0);
  } 

  private currentEnemy?: AnyMonster;
  private enemies: AnyMonster[];
  private hero: Hero;

  constructor(hero: Hero, enemies: AnyMonster[]) {
    this.hero = hero;
    this.enemies = Array.from(enemies);
  }

  public getCurrentEncounter(): Encounter {
    if (!this.currentEnemy) this.pickCurrentEnemy();
    
    const currentEnemy = this.currentEnemy as AnyMonster;
    
    const enemy = currentEnemy.type;
    const weapons = this.hero.getWeaponsAgainst(currentEnemy);

    return { enemy, weapons };
  }

  public goesOn(): boolean {
    return this.heroHitPoints > 0 && this.enemiesLeft > 0;
  }

  public resolveCurrentEncounter(weapon: ChosenWeapon): EncounterOutcome {
    if (!this.currentEnemy) {
      throw new Error(
        'No enemy picked. Method should be called after getCurrentEncounter.'
      );
    }

    let outcome: EncounterOutcome;
    
    if (weapon === 'NO_WEAPON') {
      outcome = this.hero.takeDamageFrom(this.currentEnemy);
    } else {
      outcome = this.hero.useWeaponAgainst(weapon, this.currentEnemy);
    }

    this.currentEnemy = undefined;

    return outcome;
  }

  private pickCurrentEnemy(): void {
    if (this.enemies.length === 0) {
      throw new Error('No enemies left. Raid should have ended.');
    }

    this.currentEnemy = this.enemies.shift();
  }
}
