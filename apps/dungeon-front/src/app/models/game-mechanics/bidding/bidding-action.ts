import { MonsterType, EquipmentName, Player, HeroType } from '../../models';

export type BiddingAction = 'play-bidding' | 'add-monster' | 'remove-equipment';

type DungeonExposableData = (MonsterType | 'unknown')[];
interface HeroExposableData {
  type: HeroType,
  equipment: EquipmentName[]
}

export interface BiddingExposableState {
  dungeon: DungeonExposableData;
  hero: HeroExposableData;
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
