import { ProtectionViewData } from '../protection-view-data';

const description = `
  A potion drunk before battle that grants additional hit points.
`;

export const energeticPotion: ProtectionViewData<'energetic potion'> = {
  name: 'energetic potion',
  type: 'protection',
  image: '...',
  hitPoints: 5,
  description: description,
} as const;
