import { Equipment } from './equipment';
import { WeaponName } from './equipment-name';
import { Monster } from '../models';

export class Weapon extends Equipment {
  public get availableUses() { return this._availableUses; }
  protected _availableUses: number;
  
  public readonly name: WeaponName;
  
  constructor(name: WeaponName, availableUses: number) {
    super();
    this.name = name;
    this._availableUses = availableUses;
  }

  public isUsefulAgainst(monster: Monster): boolean {
    // minimum required implementation
    return true;
  }

  public useAgainst(monster: Monster): number {
    // minimum required implementation
    return 4;
  }
}
