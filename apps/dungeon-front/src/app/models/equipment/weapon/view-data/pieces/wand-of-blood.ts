import { WeaponViewData } from '../weapon-view-data';

const description = `
  It absorbs a vampire's strength, transferring its damage value to the hero's
  hit points.
`;

export const wandOfBlood: WeaponViewData<'wand of blood'> = {
  name: 'wand of blood',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: ['vampire'],
  description: description,
} as const;
