import { InjectionToken } from '@angular/core';
import { EquipmentName, EquipmentViewData } from '../../models/models';
import { ancientCrown } from './pieces/ancient-crown';
import { blastingSpell } from './pieces/blasting-spell';
import { broadSword } from './pieces/broad-sword';
import { chaperone } from './pieces/chaperone';
import { charmingFlute } from './pieces/charming-flute';
import { coinOfLuck } from './pieces/coin-of-luck';
import { dancingSword } from './pieces/dancing-sword';
import { darkStone } from './pieces/dark-stone';
import { dragonCollar } from './pieces/dragon-collar';
import { eardrumSmasher } from './pieces/eardrum-smasher';
import { energeticPotion } from './pieces/energetic-potion';
import { evilCape } from './pieces/evil-cape';
import { fancyTunic } from './pieces/fancy-tunic';
import { healingHerbs } from './pieces/healing-herbs';
import { katana } from './pieces/katana';
import { ninjaPack } from './pieces/ninja-pack';
import { powerDrainer } from './pieces/power-drainer';
import { royalSceptre } from './pieces/royal-sceptre';
import { smokeBomb } from './pieces/smoke-bomb';
import { sophisticatedHat } from './pieces/sophisticated-hat';
import { suitor } from './pieces/suitor';
import { wandOfBlood } from './pieces/wand-of-blood';
import { woodenShuriken } from './pieces/wooden-shuriken';
import { zombieCompanion } from './pieces/zombie-companion';

export type EquipmentViewDataMap = {
  readonly [key in EquipmentName]: EquipmentViewData<key>;
}

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

export const EquipmentViewDataMapIT
  = new InjectionToken<EquipmentViewDataMap>('equipmentViewDataMap');
