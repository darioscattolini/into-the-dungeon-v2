import { PartialHeroViewData } from '../hero-view-data';

const description = `
  He is stealthy, agile and never misses a hit, neither with his katana nor with 
  his deadful shurikens. While lacking magical abilities, his profound knowledge 
  of herbs and potion making helps him stay alive.
`;

export const ninja: PartialHeroViewData<'ninja'> = {
  type: 'ninja',
  image: '/assets/images/ninja-avatar.png',
  description: description,
  baseHitPoints: 3
} as const;
