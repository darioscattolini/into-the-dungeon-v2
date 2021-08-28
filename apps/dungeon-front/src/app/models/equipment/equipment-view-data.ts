import { ProtectionViewData } from './protection/view-data/protection-view-data';
import { WeaponViewData } from './weapon/view-data/weapon-view-data';
import { EquipmentName, ProtectionName, WeaponName } from '../../models/models';
import { InjectionToken } from '@angular/core';
import { ancientCrown } from './weapon/view-data/pieces/ancient-crown';
import { blastingSpell } from './weapon/view-data/pieces/blasting-spell';
import { broadSword } from './weapon/view-data/pieces/broad-sword';
import { chaperone } from './protection/view-data/pieces/chaperone';
import { charmingFlute } from './weapon/view-data/pieces/charming-flute';
import { coinOfLuck } from './weapon/view-data/pieces/coin-of-luck';
import { dancingSword } from './weapon/view-data/pieces/dancing-sword';
import { darkStone } from './weapon/view-data/pieces/dark-stone';
import { dragonCollar } from './weapon/view-data/pieces/dragon-collar';
import { eardrumSmasher } from './weapon/view-data/pieces/eardrum-smasher';
import { energeticPotion } from './protection/view-data/pieces/energetic-potion';
import { evilCape } from './protection/view-data/pieces/evil-cape';
import { fancyTunic } from './protection/view-data/pieces/fancy-tunic';
import { healingHerbs } from './protection/view-data/pieces/healing-herbs';
import { katana } from './weapon/view-data/pieces/katana';
import { ninjaPack } from './weapon/view-data/pieces/ninja-pack';
import { powerDrainer } from './weapon/view-data/pieces/power-drainer';
import { royalSceptre } from './weapon/view-data/pieces/royal-sceptre';
import { smokeBomb } from './weapon/view-data/pieces/smoke-bomb';
import { sophisticatedHat } from './protection/view-data/pieces/sophisticated-hat';
import { suitor } from './protection/view-data/pieces/suitor';
import { wandOfBlood } from './weapon/view-data/pieces/wand-of-blood';
import { woodenShuriken } from './weapon/view-data/pieces/wooden-shuriken';
import { zombieCompanion } from './protection/view-data/pieces/zombie-companion';

export interface BaseEquipmentViewData<T extends EquipmentName> {
  readonly name: T;
  readonly image: string;
  readonly description: string;
  readonly type: 'protection' | 'weapon';
}

export type EquipmentViewData<T extends EquipmentName> 
  = T extends ProtectionName 
    ? ProtectionViewData<T>
    : T extends WeaponName
    ? WeaponViewData<T>
    : never;

export type AnyEquipmentViewData = EquipmentViewData<EquipmentName>;

export type EquipmentViewDataMap = {
  readonly [key in EquipmentName]: EquipmentViewData<key>;
}

export const EquipmentViewDataMapIT
  = new InjectionToken<EquipmentViewDataMap>('equipmentViewDataMap');

export const equipmentViewDataMap: EquipmentViewDataMap = {
  'ancient crown': ancientCrown,
  'blasting spell': blastingSpell,
  'broad sword': broadSword,
  'chaperone': chaperone,
  'charming flute': charmingFlute,
  'coin of luck': coinOfLuck,
  'dancing sword': dancingSword,
  'dark stone': darkStone,
  'dragon collar': dragonCollar,
  'eardrum smasher': eardrumSmasher,
  'energetic potion': energeticPotion,
  'evil cape': evilCape,
  'fancy tunic': fancyTunic,
  'healing herbs': healingHerbs,
  'katana': katana,
  'ninja pack': ninjaPack,
  'power drainer': powerDrainer,
  'royal sceptre': royalSceptre,
  'smoke bomb': smokeBomb,
  'sophisticated hat': sophisticatedHat,
  'suitor': suitor,
  'wand of blood': wandOfBlood,
  'wooden shuriken': woodenShuriken,
  'zombie companion': zombieCompanion
} as const;
