import { Weapon } from '../weapon';
import { WeaponEffects } from '../weapon-effects';

export type WeaponData = {
  readonly classToBeUsed: typeof Weapon;
  readonly availableUses: number;
  readonly effects: WeaponEffects;
}
