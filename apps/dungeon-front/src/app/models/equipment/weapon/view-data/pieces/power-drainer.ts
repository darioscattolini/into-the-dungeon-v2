import { WeaponViewData } from '../weapon-view-data';
import { monsterTypes } from '../../../../monster/monster-type';
// importing monsterTypes from /models.ts imports undefined

const description = `
  An ancient relic that halves the damage of any kind of creature (if damage 
  value is odd, its half is rounded to the immediately lower integer).
`;

export const powerDrainer: WeaponViewData<'power drainer'> = {
  name: 'power drainer',
  type: 'weapon',
  image: '...',
  availableUses: 2,
  effectiveAgainst: monsterTypes,
  description: description,
} as const;
