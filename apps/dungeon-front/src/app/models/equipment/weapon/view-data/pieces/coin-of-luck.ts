import { WeaponViewData } from '../weapon-view-data';

const description = `
  A magic token with the power to dispel the spirits animating undead creatures
  before they can deal any damage. Fate decides if it can be used more than once.
`;

export const coinOfLuck: WeaponViewData<'coin of luck'> = {
  name: 'coin of luck',
  type: 'weapon',
  image: '...',
  availableUses: 1,
  effectiveAgainst: ['skeleton', 'vampire', 'litch'],
  description: description,
} as const;
