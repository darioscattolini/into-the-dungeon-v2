import { InjectionToken } from '@angular/core';
import { 
  EquipmentName, ProtectionName, WeaponName 
} from '../equipment/equipment-name';
import { ProtectionData } from './protection/data/protection-data';
import { WeaponData } from './weapon/data/weapon-data';
import { ancientCrown } from './weapon/data/items/ancient-crown';
import { blastingSpell } from './weapon/data/items/blasting-spell';
import { broadSword } from './weapon/data/items/broad-sword';
import { chaperone } from './protection/data/items/chaperone';
import { charmingFlute } from './weapon/data/items/charming-flute';
import { coinOfLuck } from './weapon/data/items/coin-of-luck';
import { dancingSword } from './weapon/data/items/dancing-sword';
import { darkStone } from './weapon/data/items/dark-stone';
import { dragonCollar } from './weapon/data/items/dragon-collar';
import { eardrumSmasher } from './weapon/data/items/eardrum-smasher';
import { energeticPotion } from './protection/data/items/energetic-potion';
import { evilCape } from './protection/data/items/evil-cape';
import { fancyTunic } from './protection/data/items/fancy-tunic';
import { healingHerbs } from './protection/data/items/healing-herbs';
import { katana } from './weapon/data/items/katana';
import { ninjaPack } from './weapon/data/items/ninja-pack';
import { powerDrainer } from './weapon/data/items/power-drainer';
import { royalSceptre } from './weapon/data/items/royal-sceptre';
import { smokeBomb } from './weapon/data/items/smoke-bomb';
import { sophisticatedHat } from './protection/data/items/sophisticated-hat';
import { suitor } from './protection/data/items/suitor';
import { wandOfBlood } from './weapon/data/items/wand-of-blood';
import { woodenShuriken } from './weapon/data/items/wooden-shuriken';
import { zombieCompanion } from './protection/data/items/zombie-companion';

export type EquipmentDataMap = {
  readonly [key in EquipmentName]: key extends ProtectionName
    ? ProtectionData
    : key extends WeaponName
    ? WeaponData
    : never;
}

export const EquipmentDataMapIT 
  = new InjectionToken<EquipmentDataMap>('equipmentDataMap');

export const equipmentDataMap: EquipmentDataMap = {
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
