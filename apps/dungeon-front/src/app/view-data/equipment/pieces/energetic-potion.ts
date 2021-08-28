import { EquipmentViewData } from '../../../models/models';

const description = `
  A potion drunk before battle that grants additional hit points.
`;

export const energeticPotion: EquipmentViewData<'energetic potion'> = {
  name: 'energetic potion',
  type: 'protection',
  image: '...',
  hitPoints: 5,
  description: description,
} as const;
