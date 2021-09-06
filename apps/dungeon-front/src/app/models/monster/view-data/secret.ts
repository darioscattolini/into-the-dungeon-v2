import { MonsterViewData } from '../monster-view-data';

const description = 'Monster added by another player. You can\'t see it';

export const secret: MonsterViewData<'secret'> = {
  name: 'secret',
  damage: 'secret',
  image: '...',
  description
} as const;
