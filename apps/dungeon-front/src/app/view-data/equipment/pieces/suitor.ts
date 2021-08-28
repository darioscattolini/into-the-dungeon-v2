import { EquipmentViewData } from '../../../models/models';

const description = `
  He wants to marry the princess and follows her everywhere she goes. The
  chaperone allows it only because she knows that the princess only wants him to
  take the hardest hits.
`;

export const suitor: EquipmentViewData<'suitor'> = {
  name: 'suitor',
  type: 'protection',
  image: '...',
  hitPoints: 5,
  description: description,
} as const;
