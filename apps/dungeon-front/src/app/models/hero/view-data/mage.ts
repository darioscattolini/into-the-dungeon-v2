import { PartialHeroViewData } from '../hero-view-data';

const description = `
  He is smart, powerful and cold-blooded. Since he discovered his ability to 
  manipulate the flow of multiplanar energy, he has devoted his life to the 
  study and excercise of particularly evil magic.
`;

export const mage: PartialHeroViewData<'mage'> = {
  type: 'mage',
  image: '/assets/images/mage-avatar.png',
  description: description,
  baseHitPoints: 2
} as const;
