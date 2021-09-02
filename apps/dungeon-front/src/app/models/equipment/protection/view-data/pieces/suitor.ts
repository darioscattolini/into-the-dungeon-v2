import { ProtectionViewData } from '../protection-view-data';

const description = `
  He wants the princess' hand and follows her everywhere she goes. The chaperone
  allows it because she knows that for the princess he is only a human shield.
`;

export const suitor: ProtectionViewData<'suitor'> = {
  name: 'suitor',
  type: 'protection',
  image: '...',
  hitPoints: 5,
  description: description,
} as const;
