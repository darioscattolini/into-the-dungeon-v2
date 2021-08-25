import { PartialHeroViewData } from '../../models/models';

const description = `
  He is smart, powerful and cold-blooded. Since he discovered his ability to 
  manipulate the flow of multiplanar energy, he has devoted his life to the 
  study and excercise of particularly evil magic.
`;

export const mage: PartialHeroViewData<'mage'> = {
  type: 'mage',
  image: '...',
  description: description,
} as const;
