import { EquipmentViewData, monsterTypes } from '../../../models/models';

const description = `
  A powerful spell that destroys all kinds of enemies but also deals 2 damage to
  the caster.
`;

export const blastingSpell: EquipmentViewData<'blasting spell'> = {
  name: 'blasting spell',
  type: 'weapon',
  image: '...',
  availableUses: 2,
  effectiveAgainst: monsterTypes,
  description: description,
} as const;
