export const monsterTypes = [
  'goblin', 'skeleton', 'orc', 'vampire', 'golem', 'litch', 'demon', 'dragon'
] as const;

export type MonsterType = typeof monsterTypes[number];
