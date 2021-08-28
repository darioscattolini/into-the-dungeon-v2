import { WeaponViewData } from '../weapon-view-data';

const description = `
  Magic sword useful against golems, litches and demons. However, there is a 
  50% chance that it misses its hit.
`;

export const broadSword: WeaponViewData<'broad sword'> = {
  name: 'broad sword',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: ['golem', 'litch', 'demon'],
  description: description,
} as const;
