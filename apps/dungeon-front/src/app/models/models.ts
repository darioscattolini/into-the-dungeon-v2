// GAME MECHANICS
import { Game } from './game-mechanics/game';
import { PlayerRequirements } from './game-mechanics/player-requirements';
import { Bidding } from './game-mechanics/bidding/bidding';
import { BiddingPlayersRound } from './game-mechanics/bidding/bidding-players-round';
import {
  BiddingState,
  BiddingStateViewData
} from './game-mechanics/bidding/bidding-state';
import {
  BiddingResponseNotificationData,
  BiddingActionRequestData,
  BiddingActionResponseContent,
  BidParticipationRequestData,
  BidParticipationResponseContent,
  MonsterAdditionRequestData,
  MonsterAdditionResponseContent,
  EquipmentRemovalRequestData,
  EquipmentRemovalResponseContent
} from './game-mechanics/bidding/bidding-action';
import {
  BiddingResult,
  BiddingEndReason
} from './game-mechanics/bidding/bidding-result';
import { Raid } from './game-mechanics/raid/raid';
import { RaidState } from './game-mechanics/raid/raid-state';
import { RaidParticipants } from './game-mechanics/raid/raid-participants';
import { Encounter, EncounterOutcome } from './game-mechanics/raid/encounter';
import { ChosenWeapon } from './game-mechanics/raid/encounter';
import { RaidResult } from './game-mechanics/raid/raid-result';

export {
  Game,
  PlayerRequirements,
  Bidding,
  BiddingPlayersRound,
  BiddingResult,
  BiddingEndReason,
  BiddingState,
  BiddingStateViewData,
  BiddingResponseNotificationData,
  BiddingActionRequestData,
  BiddingActionResponseContent,
  BidParticipationRequestData,
  BidParticipationResponseContent,
  MonsterAdditionRequestData,
  MonsterAdditionResponseContent,
  EquipmentRemovalRequestData,
  EquipmentRemovalResponseContent,
  Raid,
  RaidState,
  RaidParticipants,
  Encounter,
  EncounterOutcome,
  ChosenWeapon,
  RaidResult
};

// PLAYER
import { Player } from './player/player';

export { Player };

// HERO
import { Hero } from './hero/hero';
import { HeroType, heroTypes } from './hero/hero-type';
import { HeroDataMap, HeroDataMapIT, heroDataMap } from './hero/hero-data';
import {
  AnyHeroViewData,
  PlayingHeroViewData,
  HeroViewDataMap,
  HeroViewDataMapIT,
  heroViewDataMap
} from './hero/hero-view-data';

export {
  Hero,
  HeroType,
  heroTypes,
  HeroDataMap,
  HeroDataMapIT,
  heroDataMap,
  AnyHeroViewData,
  PlayingHeroViewData,
  HeroViewDataMap,
  HeroViewDataMapIT,
  heroViewDataMap
};

// EQUIPMENT
import { Equipment } from './equipment/equipment';
import { Protection } from './equipment/protection/protection';
import { Weapon } from './equipment/weapon/weapon';
import { WeaponEffects } from './equipment/weapon/weapon-effects';
import {
  EquipmentName,
  equipmentNames,
  WeaponName,
  weaponNames,
  ProtectionName,
  protectionNames
} from './equipment/equipment-name';
import {
  EquipmentDataMap,
  EquipmentDataMapIT,
  equipmentDataMap
} from './equipment/equipment-data';
import {
  AnyEquipmentViewData,
  EquipmentViewDataMap,
  EquipmentViewDataMapIT,
  equipmentViewDataMap,
} from './equipment/equipment-view-data';
import { WeaponViewData } from './equipment/weapon/view-data/weapon-view-data';

export {
  Equipment,
  EquipmentName,
  equipmentNames,
  Protection,
  ProtectionName,
  protectionNames,
  Weapon,
  WeaponName,
  weaponNames,
  WeaponEffects,
  EquipmentDataMap,
  EquipmentDataMapIT,
  equipmentDataMap,
  AnyEquipmentViewData,
  EquipmentViewDataMap,
  EquipmentViewDataMapIT,
  equipmentViewDataMap,
  WeaponViewData
};

// MONSTER
import { Monster, AnyMonster } from './monster/monster';
import {
  MonsterType,
  MonsterTypeSecret,
  monsterTypes
} from './monster/monster-type';
import {
  MonsterDataMap,
  MonsterDataMapIT,
  monsterDataMap
} from './monster/monster-data';
import {
  MonsterViewData,
  AnyMonsterViewData,
  MonsterViewDataMap,
  MonsterViewDataMapIT,
  monsterViewDataMap
} from './monster/monster-view-data';

export {
  Monster,
  AnyMonster,
  MonsterType,
  MonsterTypeSecret,
  monsterTypes,
  MonsterDataMap,
  MonsterDataMapIT,
  monsterDataMap,
  MonsterViewData,
  AnyMonsterViewData,
  MonsterViewDataMap,
  MonsterViewDataMapIT,
  monsterViewDataMap
};

// REQUEST
import { Request } from './request/request';
import {
  BidParticipationRequest,
  MonsterAdditionRequest,
  EquipmentRemovalRequest
} from './request/bidding-action-request';
import { BiddingEndNotification } from './request/bidding-end-notification';
import { EncounterResolutionRequest } 
  from './request/encounter-resolution-request';
import { ForcibleMonsterAdditionNotification } 
  from './request/forcible-monster-addition-notification';
import { HeroChoiceRequest } from './request/hero-choice-request';
import { PlayersRequest } from './request/players-request';

export {
  Request,
  HeroChoiceRequest,
  PlayersRequest,
  BidParticipationRequest,
  MonsterAdditionRequest,
  EncounterResolutionRequest,
  EquipmentRemovalRequest,
  ForcibleMonsterAdditionNotification,
  BiddingEndNotification
};
