import { EquipmentViewData, monsterTypes } from '../../../models/models';

const description = `
  A horn that blows all kinds of enemies away. However, its blasting sound also 
  takes away one or two hit points from the bard.
`;

export const eardrumSmasher: EquipmentViewData<'eardrum smasher'> = {
  name: 'eardrum smasher',
  type: 'weapon',
  image: '...',
  availableUses: 3,
  effectiveAgainst: monsterTypes,
  description: description,
} as const;
