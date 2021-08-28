import { HeroData } from '../hero-data';

export const ninja: HeroData = {
  hitPoints: 3,
  equipment: [
    'energetic potion',
    'healing herbs',
    'katana',
    'ninja pack',
    'smoke bomb',
    'wooden shuriken'
  ]
} as const;
