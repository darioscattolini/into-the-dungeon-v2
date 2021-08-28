import { Weapon } from '../weapon';

export class CoinOfLuck extends Weapon {
  protected afterEffect(): void {
    if (Math.random() >= 0.5) this._availableUses++;
  }
}
