import { WeaponViewData } from '../weapon-view-data';

const description = `
  A special treasure from the royal heritage, with the power to tame a dragon.
  The princess not only avoids damage, but gains 5 hit points by drinking dragon
  blood.
`;

export const dragonCollar: WeaponViewData<'dragon collar'> = {
  name: 'dragon collar',
  type: 'weapon',
  image: '...',
  availableUses: 1,
  effectiveAgainst: ['dragon'],
  description: description,
} as const;
