import { WeaponViewData } from '../weapon-view-data';
import { monsterTypes } from '../../../../monster/monster-type';
// importing monsterTypes from /models.ts imports undefined

const description = `
  A relic from ancient kings that has the power to learn from defeated enemies.
  The first time it is used against a certain type of enemy it will only prevent
  a small fraction of the damage. However, it will afterwards be able to defeat 
  a new enemy of that type without taking any damage.
  Hit points lost in first attack:
  1 hp - Goblin, skeleton
  2 hp - Orc
  3 hp - Vampire, golem
  4 hp - litch
  5 hp - demon
  6 hp - dragon
`;

export const royalSceptre: WeaponViewData<'royal sceptre'> = {
  name: 'royal sceptre',
  type: 'weapon',
  image: '...',
  availableUses: Infinity,
  effectiveAgainst: monsterTypes,
  description: description,
} as const;
