import { PartialHeroViewData } from '../hero-view-data';

const description = `
  When she disappears for weeks from his father's court, everybody believes 
  she's out hunting for boyfriends. She is in fact a skilled and brave 
  adventurer, protected by bodyguards and equipped with powerful items from her 
  father's treasure.
`;

export const princess: PartialHeroViewData<'princess'> = {
  type: 'princess',
  image: '...',
  description: description,
  baseHitPoints: 2
} as const;
