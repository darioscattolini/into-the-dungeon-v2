import { EquipmentViewData } from '../../../models/models';

const description = `
  Most people find it ridiculous, especially for battles, but it provides some 
  head protection that grants additional hit points.
`;

export const sophisticatedHat: EquipmentViewData<'sophisticated hat'> = {
  name: 'sophisticated hat',
  type: 'protection',
  image: '...',
  hitPoints: 2,
  description: description,
} as const;
