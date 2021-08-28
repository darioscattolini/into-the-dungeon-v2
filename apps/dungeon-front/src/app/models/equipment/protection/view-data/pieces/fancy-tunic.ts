import { ProtectionViewData } from '../protection-view-data';

const description = `
  It looks delicate, but its strong fabric is capable of resisting bites, claws 
  and cuts.
`;

export const fancyTunic: ProtectionViewData<'fancy tunic'> = {
  name: 'fancy tunic',
  type: 'protection',
  image: '...',
  hitPoints: 5,
  description: description,
} as const;
