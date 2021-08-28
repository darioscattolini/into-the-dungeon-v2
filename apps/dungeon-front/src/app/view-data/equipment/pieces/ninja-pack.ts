import { EquipmentViewData } from '../../../models/models';

const description = `
  A set of weapons capable of defeating goblins, orcs and golems.
`;

export const ninjaPack: EquipmentViewData<'ninja pack'> = {
  name: 'ninja pack',
  type: 'weapon',
  image: '...',
  availableUses: 2,
  effectiveAgainst: ['goblin', 'orc', 'golem'],
  description: description,
} as const;
