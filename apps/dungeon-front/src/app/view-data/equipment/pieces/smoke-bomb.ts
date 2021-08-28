import { EquipmentViewData, monsterTypes } from '../../../models/models';

const description = `
  Throw it to avoid any kind of monster without taking damage
`;

export const smokeBomb: EquipmentViewData<'smoke bomb'> = {
  name: 'smoke bomb',
  type: 'weapon',
  image: '...',
  availableUses: 2,
  effectiveAgainst: monsterTypes,
  description: description,
} as const;
