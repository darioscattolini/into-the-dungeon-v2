import { EquipmentViewData } from '../../../models/models';

const description = `
  It looks delicate, but its strong fabric is capable of resisting bites, claws 
  and cuts.
`;

export const fancyTunic: EquipmentViewData<'fancy tunic'> = {
  name: 'fancy tunic',
  type: 'protection',
  image: '...',
  hitPoints: 5,
  description: description,
} as const;
