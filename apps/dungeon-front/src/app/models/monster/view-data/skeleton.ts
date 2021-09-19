import { MonsterViewData } from '../monster-view-data';

const description = `
  Humanoid remains returned from the dead by an evil spellcaster.
`;

export const skeleton: MonsterViewData<'skeleton'> = {
  name: 'skeleton',
  damage: 2,
  image: '/assets/images/skeleton-avatar.png',
  description
} as const;
