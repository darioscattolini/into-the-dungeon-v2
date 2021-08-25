import { PartialHeroViewData } from '../../models/models';

const description = `
  When she disappears for weeks from his father's court, everybody believes 
  she's out hunting for boyfriends. She is in fact a skilled and brave 
  adventurer, protected by bodyguards and equipped with powerful items from his 
  father's treasure.
`;

export const princess: PartialHeroViewData<'princess'> = {
  type: 'princess',
  image: '...',
  description: description,
} as const;
