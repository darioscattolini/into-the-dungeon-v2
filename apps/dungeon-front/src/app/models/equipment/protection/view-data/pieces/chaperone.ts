import { ProtectionViewData } from '../protection-view-data';

const description = `
  Besides preventing the princess from meeting men when out of home, this old
  woman fights besides her, taking part of the damage.
`;

export const chaperone: ProtectionViewData<'chaperone'> = {
  name: 'chaperone',
  type: 'protection',
  image: '...',
  hitPoints: 3,
  description: description,
} as const;
