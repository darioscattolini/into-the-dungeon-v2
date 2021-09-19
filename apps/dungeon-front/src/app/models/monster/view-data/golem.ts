import { MonsterViewData } from '../monster-view-data';

const description = `
  Strong magical creature created from stone by a wizard's spell.
`;

export const golem: MonsterViewData<'golem'> = {
  name: 'golem',
  damage: 5,
  image: '/assets/images/golem-avatar.png',
  description
} as const;
