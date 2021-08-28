import { WeaponViewData } from '../weapon-view-data';

const description = `
  A sword capable of defeating goblins, orcs, golems and dragons.
`;

export const dancingSword: WeaponViewData<'dancing sword'> = {
  name: 'dancing sword',
  type: 'weapon',
  image: '...',
  availableUses: 2,
  effectiveAgainst: ['goblin', 'orc', 'golem', 'dragon'],
  description: description,
} as const;
