import { MonsterType, EquipmentName, Player } from '../../models';

export interface BidParticipationRequest {
  action: 'play-bidding';
  player: Player;
}

export interface MonsterAdditionRequest {
  action: 'add-monster';
  player: Player;
  content: MonsterType;
}

export interface EquipmentRemovalRequest {
  action: 'remove-equipment';
  player: Player;
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

export type BiddingAction = BiddingActionRequest['action'];
