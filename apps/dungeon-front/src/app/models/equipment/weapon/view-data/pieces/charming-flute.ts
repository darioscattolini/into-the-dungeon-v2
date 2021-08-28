import { WeaponViewData } from '../weapon-view-data';
import { monsterTypes } from '../../../../monster/monster-type';
// importing monsterTypes from /models.ts imports undefined

const description = `
  A flute with the power to enchant goblins. Once a goblin is charmed, it deals
  no damage. The flute can then be used to lead charmed goblins against other 
  types of monsters, reducing their damage by 1 per each enchanted goblin.
`;

export const charmingFlute: WeaponViewData<'charming flute'> = {
  name: 'charming flute',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: monsterTypes,
  description: description,
} as const;
