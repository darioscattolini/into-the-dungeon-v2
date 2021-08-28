import { EquipmentViewData } from '../../../models/models';

const description = `
  A magic token with the power to dispel the spirits giving life to undead
  creatures, thus making skeletons, vampires and litches return to inanimate 
  form before they can deal any damage. Fate decides if it can be used more than
  once.
`;

export const coinOfLuck: EquipmentViewData<'coin of luck'> = {
  name: 'coin of luck',
  type: 'weapon',
  image: '...',
  availableUses: 1,
  effectiveAgainst: ['skeleton', 'vampire', 'litch'],
  description: description,
} as const;
