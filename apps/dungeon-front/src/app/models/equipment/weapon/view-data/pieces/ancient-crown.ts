import { WeaponViewData } from '../weapon-view-data';
import { monsterTypes } from '../../../../monster/monster-type';
// importing monsterTypes from /models.ts imports undefined

const description = `
  Its shine and beauty distracts all kinds of enemies, reducing their damage by 
  2.
`;

export const ancientCrown: WeaponViewData<'ancient crown'> = {
  name: 'ancient crown',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: monsterTypes,
  description: description,
} as const;
