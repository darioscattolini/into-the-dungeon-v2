import { WeaponViewData } from '../weapon-view-data';

const description = `
  Throw it to avoid any kind of monster without taking damage
`;

export const smokeBomb: WeaponViewData<'smoke bomb'> = {
  name: 'smoke bomb',
  type: 'weapon',
  image: '...',
  availableUses: 2,
  effectiveAgainst: ['all monsters'],
  description: description,
} as const;
