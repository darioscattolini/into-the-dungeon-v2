import { EquipmentViewData } from '../../../models/models';

const description = `
  Magic sword useful against golems, litches and demons. However, there is a 
  50% chance that it misses its hit.
`;

export const broadSword: EquipmentViewData<'broad sword'> = {
  name: 'broad sword',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: ['golem', 'litch', 'demon'],
  description: description,
} as const;
