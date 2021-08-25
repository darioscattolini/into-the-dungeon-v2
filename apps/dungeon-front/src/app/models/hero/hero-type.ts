export const heroTypes = [
  'bard', 
  'mage', 
  'ninja', 
  'princess'
] as const;

export type HeroType = typeof heroTypes[number];
