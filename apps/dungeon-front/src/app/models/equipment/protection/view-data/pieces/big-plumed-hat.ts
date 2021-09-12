import { ProtectionViewData } from '../protection-view-data';

const description = `
  Most people find it ridiculous, especially for battles, but it provides some 
  head protection that grants additional hit points.
`;

export const bigPlumedHat: ProtectionViewData<'big plumed hat'> = {
  name: 'big plumed hat',
  type: 'protection',
  image: '...',
  hitPoints: 2,
  description: description,
} as const;
