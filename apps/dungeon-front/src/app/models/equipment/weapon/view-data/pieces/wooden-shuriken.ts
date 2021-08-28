import { WeaponViewData } from '../weapon-view-data';

const description = `
  It defeats a vampire when directed straight at its heart.
`;

export const woodenShuriken: WeaponViewData<'wooden shuriken'> = {
  name: 'wooden shuriken',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: ['vampire'],
  description: description,
} as const;
