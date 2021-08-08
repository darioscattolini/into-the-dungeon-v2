const bardEquipmentNames = [ 
  'fancy tunic',
  'sophisticated hat',
  'elfish harp',
  'charming flute',
  'dancing sword',
  'coin of luck'
] as const;

const mageEquipmentNames = [
  'zombie companion',
  'evil cape',
  'blasting spell',
  'dark stone',
  'wand of blood',
  'power drainer'
] as const;

const ninjaEquipmentNames = [
  'energetic potion',
  'healing herbs',
  'wooden shuriken',
  'katana',
  'smoke bomb',
  'ninja pack'
] as const;

const princessEquipmentNames = [
  'suitor',
  'chaperone',
  'dragon collar',
  'ancient crown',
  'royal sceptre',
  'broad sword',
];

type BardEquipmentName = typeof bardEquipmentNames[number];
type MageEquipmentName = typeof mageEquipmentNames[number];
type NinjaEquipmentName = typeof ninjaEquipmentNames[number];
type PrincessEquipmentName = typeof princessEquipmentNames[number];

export type EquipmentName = 
  | BardEquipmentName
  | MageEquipmentName
  | NinjaEquipmentName
  | PrincessEquipmentName;

export const equipmentNames = [
  ...bardEquipmentNames, 
  ...mageEquipmentNames, 
  ...ninjaEquipmentNames,
  ...princessEquipmentNames
] as const;
