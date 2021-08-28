import { EquipmentViewData } from '../../../models/models';

const description = `
  A sword capable of defeating goblins, orcs, golems and dragons.
`;

export const dancingSword: EquipmentViewData<'dancing sword'> = {
  name: 'dancing sword',
  type: 'weapon',
  image: '...',
  availableUses: 2,
  effectiveAgainst: ['goblin', 'orc', 'golem', 'dragon'],
  description: description,
} as const;
