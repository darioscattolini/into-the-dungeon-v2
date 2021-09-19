import { MonsterViewData } from '../monster-view-data';

const description = `
  Smart and long-lived magical reptile, one of the most powerful creatures on earth.
`;

export const dragon: MonsterViewData<'dragon'> = {
  name: 'dragon',
  damage: 9,
  image: '/assets/images/dragon-avatar.png',
  description
} as const;
