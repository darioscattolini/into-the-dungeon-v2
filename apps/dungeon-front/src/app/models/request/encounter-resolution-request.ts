import { HasTarget, TargetedRequest } from './request';
import { 
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
  = TargetedRequest<WeaponName, EncounterResolutionRequestContent>;
