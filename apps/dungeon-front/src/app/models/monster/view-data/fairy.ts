import { MonsterViewData } from '../monster-view-data';

const description = `
  A little flying creature with no effect against heroes.
`;

export const fairy: MonsterViewData<'fairy'> = {
  name: 'fairy',
  damage: 0,
  image: '/assets/images/fairy-avatar.png',
  description
} as const;
