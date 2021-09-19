import { MonsterViewData } from '../monster-view-data';

const description = `
  Evil and smart humanoid creature of medium strength.
`;

export const orc: MonsterViewData<'orc'> = {
  name: 'orc',
  damage: 3,
  image: '/assets/images/orc-avatar.png',
  description
} as const;
