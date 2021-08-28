import { Weapon } from './weapon';
import { WeaponEffects } from './weapon-effects';
import { AnyMonster } from '../../models';

export class RoyalSceptre extends Weapon {
  protected afterEffect(target: AnyMonster): void {
    const changedEffect: WeaponEffects = {};
    changedEffect[target.type] = () => 0;
    this.addEffects(changedEffect);
  }
}
