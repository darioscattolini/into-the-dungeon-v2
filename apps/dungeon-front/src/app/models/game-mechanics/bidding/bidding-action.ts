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
  remainingMonsters: number;
  remainingPlayers: number;
}

interface BiddingActionRequestDataBase {
  action: BiddingAction;
  player: Player;
  content?: MonsterType | EquipmentName[];
  state: BiddingExposableState;
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
