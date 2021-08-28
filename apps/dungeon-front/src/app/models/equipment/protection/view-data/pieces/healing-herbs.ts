import { ProtectionViewData } from '../protection-view-data';

const description = `
  A mixture of herbs that can extend the hero's life during battle.
`;

export const healingHerbs: ProtectionViewData<'healing herbs'> = {
  name: 'healing herbs',
  type: 'protection',
  image: '...',
  hitPoints: 3,
  description: description,
} as const;
