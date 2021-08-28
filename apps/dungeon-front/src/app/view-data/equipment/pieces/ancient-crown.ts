import { EquipmentViewData, monsterTypes } from '../../../models/models';

const description = `
  Its shine and beauty distracts all kinds of enemies, reducing their damage by 
  2.
`;

export const ancientCrown: EquipmentViewData<'ancient crown'> = {
  name: 'ancient crown',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: monsterTypes,
  description: description,
} as const;
