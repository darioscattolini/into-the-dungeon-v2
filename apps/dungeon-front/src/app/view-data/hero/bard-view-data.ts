import { PartialHeroViewData } from '../../models/models';

const description = `
  Blabbermouth, boastful and stylish, he looks like the most unsuitable 
  adventurer. However, powerful charming skills, the lore he acquired along his 
  travels and supernatural luck have proven otherwise.
`;

export const bard: PartialHeroViewData<'bard'> = {
  type: 'bard',
  image: '...',
  description: description,
} as const;
