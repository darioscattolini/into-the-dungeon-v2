import { HasTarget, TargetedRequest } from './request';
import { 
  BiddingStateViewData, MonsterType, MonsterViewData, EquipmentName
} from '../models';

interface BiddingActionRequestContent extends HasTarget {
  state: BiddingStateViewData;
}

interface MonsterAdditionRequestContent extends BiddingActionRequestContent {
  monster: MonsterViewData<MonsterType>;
}

type BiddingActionRequest<Response, Content extends BiddingActionRequestContent> 
  = TargetedRequest<Response, Content>;

export type BidParticipationRequest 
  = BiddingActionRequest<boolean, BiddingActionRequestContent>;

export type MonsterAdditionRequest 
  = BiddingActionRequest<boolean, MonsterAdditionRequestContent>;

export type EquipmentRemovalRequest 
  = BiddingActionRequest<EquipmentName, BiddingActionRequestContent>;
  