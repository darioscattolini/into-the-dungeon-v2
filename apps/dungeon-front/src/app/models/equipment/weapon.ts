import { Equipment } from './equipment';
import { WeaponName } from './equipment-name';

export class Weapon extends Equipment {
  public readonly name: WeaponName;
  
  constructor(name: WeaponName) {
    super();
    this.name = name;
  }
}
