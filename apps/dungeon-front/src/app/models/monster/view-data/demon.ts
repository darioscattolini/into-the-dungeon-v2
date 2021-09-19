import { MonsterViewData } from '../monster-view-data';

const description = `
  Powerful, ancestral and evil creature that managed to escape the underworld.
`;

export const demon: MonsterViewData<'demon'> = {
  name: 'demon',
  damage: 7,
  image: '/assets/images/demon-avatar.png',
  description
} as const;
