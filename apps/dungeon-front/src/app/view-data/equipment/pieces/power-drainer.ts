import { EquipmentViewData, monsterTypes } from '../../../models/models';

const description = `
  An ancient relic that halves the damage of any kind of creature (if damage 
  value is odd, its half is rounded to the immediately lower integer).
`;

export const powerDrainer: EquipmentViewData<'power drainer'> = {
  name: 'power drainer',
  type: 'weapon',
  image: '...',
  availableUses: 2,
  effectiveAgainst: monsterTypes,
  description: description,
} as const;
