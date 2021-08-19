import { Player, MonsterType, EquipmentName } from '../../models';

type BiddingNotificationMessage = 
  | 'monster-equipment-choice'
  | 'bidding-withdrawal'
  | 'necessarily-add-monster'
  | 'monster-added'
  | 'no-monster-added'
  | 'equipment-removed';

type BiddingNotificationEntity = MonsterType | EquipmentName;

interface EndOfTurnNotification {
  nextPlayer: Player;
  warnings: {
    lastMonster: boolean;
    noEquipment: boolean;
  };
}

type EndOfBiddingReason = 'last-monster' | 'last-bidder';

interface EndOfBiddingNotification {
  raider: Player;
  reason: EndOfBiddingReason;
}

interface BiddingNotificationBase {
  target: Player;
  message: BiddingNotificationMessage;
  entity?: BiddingNotificationEntity;
  endOfTurn?: EndOfTurnNotification;
  endOfBidding?: EndOfBiddingNotification;
}

interface PlayBiddingContinueNotification extends BiddingNotificationBase {
  message: 'monster-equipment-choice';
  entity: undefined;
  endOfTurn: undefined;
  endOfBidding: undefined;
}

interface PlayBiddingEndTurnNotification extends BiddingNotificationBase {
  message: 'necessarily-add-monster';
  entity: MonsterType;
  endOfTurn: {
    nextPlayer: Player;
    warnings: {
      lastMonster: boolean;
      noEquipment: false;
    };
  };
  endOfBidding: undefined;
}

interface PlayBiddingEndBiddingNotification extends BiddingNotificationBase {
  message: 'necessarily-add-monster';
  entity: MonsterType;
  endOfTurn: undefined;
  endOfBidding: {
    reason: 'last-monster';
    raider: Player;
  }
}

interface WithdrawEndTurnNotification extends BiddingNotificationBase {
  message: 'bidding-withdrawal';
  entity: undefined;
  endOfTurn: {
    nextPlayer: Player;
    warnings: {
      lastMonster: false;
      noEquipment: false;
    };
  }
  endOfBidding: undefined;
}

interface WithdrawEndBiddingNotification extends BiddingNotificationBase {
  message: 'bidding-withdrawal';
  entity: undefined;
  endOfTurn: undefined;
  endOfBidding: {
    reason: 'last-bidder';
    raider: Player;
  };
}

interface AddedMonsterEndTurnNotification extends BiddingNotificationBase {
  message: 'monster-added';
  entity: MonsterType;
  endOfTurn: {
    nextPlayer: Player;
    warnings: {
      lastMonster: boolean;
      noEquipment: false;
    };
  };
  endOfBidding: undefined;
}

interface NoAddedMonsterNotification extends BiddingNotificationBase {
  message: 'no-monster-added';
  entity: undefined;
  endOfTurn: undefined;
  endOfBidding: undefined;
}

interface AddedMonsterEndBiddingNotification extends BiddingNotificationBase {
  message: 'monster-added';
  entity: MonsterType;
  endOfTurn: undefined;
  endOfBidding: {
    reason: 'last-monster';
    raider: Player;
  };
}

interface RemovedEquipmentEndTurnNotification extends BiddingNotificationBase {
  message: 'equipment-removed';
  entity: EquipmentName;
  endOfTurn: {
    nextPlayer: Player;
    warnings: {   // FOUR COMBINATIONS ALLOWED
      lastMonster: boolean;
      noEquipment: boolean;
    };
  };
  endOfBidding: undefined;
 }

 interface RemovedEquipmentEndBiddingNotification extends BiddingNotificationBase {
  message: 'equipment-removed';
  entity: EquipmentName;
  endOfTurn: undefined;
  endOfBidding: {
    reason: 'last-monster';
    raider: Player;
  };
}

export type BiddingNotification = 
  | PlayBiddingContinueNotification 
  | PlayBiddingEndTurnNotification 
  | PlayBiddingEndBiddingNotification 
  | WithdrawEndTurnNotification 
  | WithdrawEndBiddingNotification 
  | AddedMonsterEndTurnNotification 
  | NoAddedMonsterNotification 
  | AddedMonsterEndBiddingNotification 
  | RemovedEquipmentEndTurnNotification 
  | RemovedEquipmentEndBiddingNotification;

/*
  ALL POSSIBLE CASES:

  BIDDING ACCEPTED, 0 EQUIPMENT, >2 MONSTERS LEFT (PlayBidWithNoEquipmentAndContinuesNotification)
  * Target: current player
  * Message: No equipment to remove, monster is necessarily added
  * Entity: Added monster
  * End of turn - next player

  BIDDING ACCEPTED, 0 EQUIPMENT, 2 MONSTER LEFT (PlayBidWithNoEquipmentAndContinuesNotification)
  * Target: current player
  * Message: No equipment to remove, monster is necessarily added
  * Entity: Added monster
  * Warning: last monster (next player accepting bid will be raider)
  * End of turn - next player

  BIDDING ACCEPTED, 0 EQUIPMENT, 1 MONSTER LEFT (PlayBidWithNoEquipmentAndEndsNotification)
  * Target: current player
  * Message: No equipment to remove, last monster is necessarily added
  * Entity: Added monster
  * Bidding phase ends, you are raider

  BIDDING ACCEPTED >0 EQUIPMENT (PlayBidWithEquipment)
  * Target: current player
  * Message: will chosse between adding monster or removing equipment
  * Turn continues

  BIDDING REJECTED, >2 BIDDING PLAYERS LEFT (WithdrawalAndContinuesNotification)
  * Target: current player
  * Message: You withdraw from bidding, out of game until next bidding phase
  * End of turn - next player

  BIDDING REJECTED, 2 BIDDING PLAYER LEFT (WithdrawalAndEndsNotification)
  * Target: current player
  * Message: You withdraw from bidding, out of game until next bidding phase
  * Bidding phase ends, next player is raider

  ADD MONSTER ACCEPTED, >2 MONSTERS LEFT (MonsterAdditionAndContinuesNotification)
  * Target: current player
  * Message: monster added to dungeon
  * Entity: Added monster
  * End of turn - next player

  ADD MONSTER ACCEPTED, 2 MONSTERS LEFT (MonsterAdditionAndContinuesNotification)
  * Target: current player
  * Message: monster added to dungeon
  * Entity: Added monster
  * Warning: last monster (next player accepting bid will be raider)
  * End of turn - next player

  ADD MONSTER ACCEPTED, 1 MONSTER LEFT (MonsterAdditionAndEndsNotification)
  * Target: current player
  * Message: monster added to dungeon
  * Entity: Added monster
  * Bidding phase ends, you are raider

  ADD MONSTER REJECTED (NoMonsterAdditionNotification)
  * Target: current player
  * Message: no monster added to dungeon, will have to remove equipment
  * Turn continues

  EQUIPMENT REMOVAL, >2 MONSTER LEFT, >1 EQUIPMENT LEFT (EquipmentRemovalNotification)
  * Target: current player
  * Message: equipment removed from hero
  * Entity: removed equipment
  * End of turn - next player

  EQUIPMENT REMOVAL, >2 MONSTER LEFT, 1 EQUIPMENT LEFT (EquipmentRemovalNotification)
  * Target: current player
  * Message: equipment removed from hero
  * Entity: removed equipment
  * Warning: no equipment left (next players accepting bid will have to add monsters)
  * End of turn - next player

  EQUIPMENT REMOVAL, 1 MONSTER LEFT, >1 EQUIPMENT LEFT (EquipmentRemovalNotification)
  * Target: current player
  * Message: equipment removed from hero
  * Entity: removed equipment
  * Warning: last monster
  * End of turn - next player

  EQUIPMENT REMOVAL, 1 MONSTER LEFT, 1 EQUIPMENT LEFT (EquipmentRemovalNotification)
  * Target: current player
  * Message: equipment removed from hero
  * Entity: removed equipment
  * Warning: last monster, no equipment
  * End of turn - next player
  
  EQUIPMENT REMOVAL, 0 MONSTER LEFT
  * Target: current player
  * Message: equipment removed from hero
  * Entity: removed equipment
  * Bidding phase ends, you are raider
*/
