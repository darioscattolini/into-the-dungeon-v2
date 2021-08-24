import { EquipmentBase } from './equipment-base';
import { WeaponName } from './equipment-name';
import { WeaponEffects } from './weapon-effects';
import { AnyMonster } from '../models';

export class Weapon implements EquipmentBase<'weapon'> {
  public get availableUses() { return this._availableUses; }
  private _availableUses: number;
  
  public readonly name: WeaponName;
  public readonly type = 'weapon';

  private effects: WeaponEffects;
  
  constructor(name: WeaponName, availableUses: number, effects: WeaponEffects) {
    this.name = name;
    this._availableUses = availableUses;
    this.effects = Object.assign({}, effects);
  }

  public isUsefulAgainst(monster: AnyMonster): boolean {
    this.validateAvailability();

    return this.effects[monster.type] !== undefined;
  }

  public useAgainst(target: AnyMonster): number {
    this.validateAvailability();
    
    const calculateResult = this.effects[target.type];

    if (!calculateResult) {
      throw new Error(`${this.name} cannot be used against ${target.type}.`);
    }

    const result = calculateResult(target.damage);

    this.afterEffect(target);

    this._availableUses--;
    
    return result;
  }

  protected addEffects(effects: WeaponEffects): void {
    const additions = Object.keys(effects) as Array<keyof typeof effects>;
    
    for (const monster of additions) {
      this.effects[monster] = effects[monster];
    }
  }

  protected afterEffect(target: AnyMonster): void {
    // implemented only for children classes requiring it
  };

  private validateAvailability() {
    if (this.availableUses === 0) {
      throw new Error(
        'availableUses is 0. Weapon should have been discarded after last use.'
      );
    }
  }
}
