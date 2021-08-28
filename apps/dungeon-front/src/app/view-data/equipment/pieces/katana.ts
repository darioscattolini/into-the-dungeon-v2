import { EquipmentViewData } from '../../../models/models';

const description = `
  This blade is impregnated in a substance that is not effective with lesser
  creatures, but can defeat demons and dragons before they cause any damage.
`;

export const katana: EquipmentViewData<'katana'> = {
  name: 'katana',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: ['demon', 'dragon'],
  description: description,
} as const;
