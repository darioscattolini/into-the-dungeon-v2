import { MonsterType, EquipmentName, Player } from '../../models';

export type BiddingAction = 'play-bidding' | 'add-monster' | 'remove-equipment';

export type DungeonExposableData = (MonsterType | 'unknown')[];

type BiddingExposableState = {
  dungeon: DungeonExposableData;
}

interface BiddingActionRequestBase {
  action: BiddingAction;
  player: Player;
  content?: MonsterType | EquipmentName[];
  state: BiddingExposableState;
}

export interface BidParticipationRequest extends BiddingActionRequestBase {
  action: 'play-bidding';
  content: undefined;
}

export interface MonsterAdditionRequest extends BiddingActionRequestBase {
  action: 'add-monster';
  content: MonsterType;
}

export interface EquipmentRemovalRequest extends BiddingActionRequestBase {
  action: 'remove-equipment';
  content: EquipmentName[];
}

export interface BidParticipationResponse {
  action: 'play-bidding';
  content: boolean
}

export interface MonsterAdditionResponse {
  action: 'add-monster';
  content: boolean
}

export interface EquipmentRemovalResponse {
  action: 'remove-equipment';
  content: EquipmentName
}

export type BiddingActionRequest = 
  | BidParticipationRequest 
  | MonsterAdditionRequest 
  | EquipmentRemovalRequest;

export type BiddingActionResponse =
  | BidParticipationResponse 
  | MonsterAdditionResponse 
  | EquipmentRemovalResponse;
