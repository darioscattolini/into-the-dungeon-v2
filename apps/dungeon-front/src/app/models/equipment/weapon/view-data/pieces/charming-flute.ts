import { WeaponViewData } from '../weapon-view-data';

const description = `
  This flute can enchant goblins. Charmed goblins deal no damage, and can be led 
  against other monsters, reducing their damage by 1 per enchanted goblin.
`;

export const charmingFlute: WeaponViewData<'charming flute'> = {
  name: 'charming flute',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: ['all monsters'],
  description: description,
} as const;
