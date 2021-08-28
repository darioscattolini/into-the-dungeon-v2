import { MonsterViewData } from '../monster-view-data';

const description = `
  It avoids death by sucking other creatures' blood to steal their life force.
`;

export const vampire: MonsterViewData<'vampire'> = {
  name: 'vampire',
  damage: 4,
  image: '...',
  description
} as const;
