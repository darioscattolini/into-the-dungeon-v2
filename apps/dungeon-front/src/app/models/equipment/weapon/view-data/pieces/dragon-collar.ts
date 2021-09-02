import { WeaponViewData } from '../weapon-view-data';

const description = `
  A special treasure from the royal heritage, with the power to tame a dragon.
  The dragon cooperates with its bearer, providing her 5 additional hit points.
`;

export const dragonCollar: WeaponViewData<'dragon collar'> = {
  name: 'dragon collar',
  type: 'weapon',
  image: '...',
  availableUses: 1,
  effectiveAgainst: ['dragon'],
  description: description,
} as const;
