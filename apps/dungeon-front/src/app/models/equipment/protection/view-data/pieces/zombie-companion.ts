import { ProtectionViewData } from '../protection-view-data';

const description = `
  It is too slow and can barely fight, but its resistance make it a great 
  "human" shield.
`;

export const zombieCompanion: ProtectionViewData<'zombie companion'> = {
  name: 'zombie companion',
  type: 'protection',
  image: '...',
  hitPoints: 6,
  description: description,
} as const;
