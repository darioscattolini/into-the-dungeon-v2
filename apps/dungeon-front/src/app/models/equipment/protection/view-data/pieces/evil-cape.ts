import { ProtectionViewData } from '../protection-view-data';

const description = `
  Piece of cloth from a fabric impregnated in some evil creature's blood.
`;

export const evilCape: ProtectionViewData<'evil cape'> = {
  name: 'evil cape',
  type: 'protection',
  image: '...',
  hitPoints: 3,
  description: description,
} as const;
