import { WeaponViewData } from '../weapon-view-data';

const description = `
  A powerful spell that destroys all kinds of enemies but also deals 2 damage to
  the caster.
`;

export const blastingSpell: WeaponViewData<'blasting spell'> = {
  name: 'blasting spell',
  type: 'weapon',
  image: '...',
  availableUses: 2,
  effectiveAgainst: ['all monsters'],
  description: description,
} as const;
