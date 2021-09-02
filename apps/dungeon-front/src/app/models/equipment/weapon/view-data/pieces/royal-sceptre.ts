import { WeaponViewData } from '../weapon-view-data';

const description = `
  An ancient relic that prevents a small fraction of the damage of a monster, and
  avoids it completely if it has already been used against that type of monster.
`;

export const royalSceptre: WeaponViewData<'royal sceptre'> = {
  name: 'royal sceptre',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: ['all monsters'],
  description: description,
} as const;
