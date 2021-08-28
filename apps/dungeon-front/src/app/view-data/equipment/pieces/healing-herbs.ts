import { EquipmentViewData } from '../../../models/models';

const description = `
  A mixture of herbs that can extend the hero's life during battle.
`;

export const healingHerbs: EquipmentViewData<'healing herbs'> = {
  name: 'healing herbs',
  type: 'protection',
  image: '...',
  hitPoints: 3,
  description: description,
} as const;
