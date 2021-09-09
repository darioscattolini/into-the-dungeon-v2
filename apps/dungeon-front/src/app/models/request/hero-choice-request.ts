import { HasTarget, TargetedRequest } from './request';
import { HeroType, AnyHeroViewData } from '../models';

interface HeroChoiceRequestContent extends HasTarget {
  options: AnyHeroViewData[];
}

export type HeroChoiceRequest 
  = TargetedRequest<HeroType, HeroChoiceRequestContent>;
