import { MonsterType, EquipmentName, Player } from '../models';

export interface BidParticipationRequest {
  type: 'play-bidding';
  player: Player;
}

export interface MonsterAdditionRequest {
  type: 'add-monster';
  player: Player;
  content: MonsterType;
}

export interface EquipmentRemovalRequest {
  type: 'remove-equipment';
  player: Player;
  content: EquipmentName[];
}

export interface BidParticipationResponse {
  type: 'play-bidding';
  content: boolean
}

export interface MonsterAdditionResponse {
  type: 'add-monster';
  content: boolean
}

export interface EquipmentRemovalResponse {
  type: 'remove-equipment';
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
