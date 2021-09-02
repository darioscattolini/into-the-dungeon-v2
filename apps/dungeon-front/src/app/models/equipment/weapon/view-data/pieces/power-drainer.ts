import { WeaponViewData } from '../weapon-view-data';

const description = `
  An ancient relic that halves the damage of any kind of creature (if damage 
  value is odd, its half is rounded to the immediately lower integer).
`;

export const powerDrainer: WeaponViewData<'power drainer'> = {
  name: 'power drainer',
  type: 'weapon',
  image: '...',
  availableUses: 2,
  effectiveAgainst: ['all monsters'],
  description: description,
} as const;
