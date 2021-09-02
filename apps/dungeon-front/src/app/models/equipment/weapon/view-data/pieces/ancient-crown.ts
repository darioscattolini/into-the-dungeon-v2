import { WeaponViewData } from '../weapon-view-data';

const description = `
  Its shine and beauty distract all kinds of enemies, reducing their damage by 2.
`;

export const ancientCrown: WeaponViewData<'ancient crown'> = {
  name: 'ancient crown',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: ['all monsters'],
  description: description,
} as const;
