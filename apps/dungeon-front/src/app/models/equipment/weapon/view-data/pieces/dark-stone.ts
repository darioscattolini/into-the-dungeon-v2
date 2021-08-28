import { WeaponViewData } from '../weapon-view-data';

const description = `
  A magic infused stone capable of defeating minor living creatures such as
  goblins and orcs.
`;

export const darkStone: WeaponViewData<'dark stone'> = {
  name: 'dark stone',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: ['goblin', 'orc'],
  description: description,
} as const;
