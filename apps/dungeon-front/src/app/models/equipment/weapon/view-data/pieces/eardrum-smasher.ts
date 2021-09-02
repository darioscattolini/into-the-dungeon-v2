import { WeaponViewData } from '../weapon-view-data';

const description = `
  A horn that blows all kinds of enemies away. However, its blasting sound also 
  takes away one or two hit points from the bard.
`;

export const eardrumSmasher: WeaponViewData<'eardrum smasher'> = {
  name: 'eardrum smasher',
  type: 'weapon',
  image: '...',
  availableUses: 3,
  effectiveAgainst: ['all monsters'],
  description: description,
} as const;
