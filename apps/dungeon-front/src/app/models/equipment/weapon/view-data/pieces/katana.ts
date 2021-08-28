import { WeaponViewData } from '../weapon-view-data';

const description = `
  This blade is impregnated in a substance that is not effective with lesser
  creatures, but can defeat demons and dragons before they cause any damage.
`;

export const katana: WeaponViewData<'katana'> = {
  name: 'katana',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: ['demon', 'dragon'],
  description: description,
} as const;
