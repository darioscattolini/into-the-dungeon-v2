import { WeaponViewData } from '../weapon-view-data';

const description = `
  A set of weapons capable of defeating goblins, orcs and golems.
`;

export const ninjaPack: WeaponViewData<'ninja pack'> = {
  name: 'ninja pack',
  type: 'weapon',
  image: '...',
  availableUses: 2,
  effectiveAgainst: ['goblin', 'orc', 'golem'],
  description: description,
} as const;
