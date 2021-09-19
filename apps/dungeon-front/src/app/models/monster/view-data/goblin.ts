import { MonsterViewData } from '../monster-view-data';

const description = `
  Small and weak creature, particularly greedy for gold and jewelry.
`;

export const goblin: MonsterViewData<'goblin'> = {
  name: 'goblin',
  damage: 1,
  image: '/assets/images/goblin-avatar.png',
  description
} as const;
