export const monsterTypes = [
  'fairy', 
  'goblin', 
  'skeleton', 
  'orc', 
  'vampire', 
  'golem', 
  'litch', 
  'demon', 
  'dragon'
] as const;

export type MonsterType = typeof monsterTypes[number];

export type MonsterTypeSecret = MonsterType | 'secret';
