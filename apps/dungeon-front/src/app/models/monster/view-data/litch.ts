import { MonsterViewData } from '../monster-view-data';

const description = `
  Former spellcaster turned into evil undead after attempting to achieve immortality.
`;

export const litch: MonsterViewData<'litch'> = {
  name: 'litch',
  damage: 6,
  image: '/assets/images/litch-avatar.png',
  description
} as const;
