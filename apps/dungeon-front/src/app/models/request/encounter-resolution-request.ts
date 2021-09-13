import { HasTarget, TargetedRequest } from './request';
import {
  ChosenWeapon,
  MonsterType, 
  MonsterViewData,
  PlayingHeroViewData,
  WeaponName,
  WeaponViewData
} from '../models';

interface EncounterResolutionRequestContent extends HasTarget {
  encounter: {
    enemy: MonsterViewData<MonsterType>,
    weapons: WeaponViewData<WeaponName>[]
  },
  state: {
    hero: PlayingHeroViewData,
    remainingEnemies: number
  }
}

export type EncounterResolutionRequest 
  = TargetedRequest<ChosenWeapon, EncounterResolutionRequestContent>;
