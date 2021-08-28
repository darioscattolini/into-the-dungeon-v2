import { MonsterViewData } from '../monster-view-data';

const description = `
  Evil and smart humanoid creature of medium strength.
`;

export const orc: MonsterViewData<'orc'> = {
  name: 'orc',
  damage: 3,
  image: '...',
  description
} as const;
