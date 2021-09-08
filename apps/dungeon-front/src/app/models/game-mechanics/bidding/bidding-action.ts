import { BiddingState } from './bidding-state';
import { MonsterType, EquipmentName, Player } from '../../models';

export type BiddingAction = 'play-bidding' | 'add-monster' | 'remove-equipment';

interface BiddingActionRequestDataBase {
  action: BiddingAction;
  player: Player;
  content?: MonsterType | EquipmentName[];
  state: BiddingState;
}

export interface BidParticipationRequestData 
  extends BiddingActionRequestDataBase {
    action: 'play-bidding';
    content: undefined;
  }

export interface MonsterAdditionRequestData 
  extends BiddingActionRequestDataBase {
    action: 'add-monster';
    content: MonsterType;
  }

export interface EquipmentRemovalRequestData 
  extends BiddingActionRequestDataBase {
    action: 'remove-equipment';
    content: EquipmentName[];
  }

export interface BidParticipationResponseContent {
  action: 'play-bidding';
  content: boolean
}

export interface MonsterAdditionResponseContent {
  action: 'add-monster';
  content: boolean
}

export interface EquipmentRemovalResponseContent {
  action: 'remove-equipment';
  content: EquipmentName
}

export type BiddingActionRequestData = 
  | BidParticipationRequestData 
  | MonsterAdditionRequestData 
  | EquipmentRemovalRequestData;

export type BiddingActionResponseContent =
  | BidParticipationResponseContent 
  | MonsterAdditionResponseContent 
  | EquipmentRemovalResponseContent;

export interface ForcibleMonsterAdditionNotificationData {
  player: Player;
  forciblyAddedMonster: MonsterType;
}
export interface BiddingResponseNotificationData {
  notification?: ForcibleMonsterAdditionNotificationData;
}
