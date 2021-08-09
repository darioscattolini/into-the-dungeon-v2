// GAME MECHANICS
import { Game } from './game-mechanics/game';
import { Bidding } from './game-mechanics/bidding';
import { BiddingPlayersRound } from "./game-mechanics/bidding-players-round";
import { 
  BiddingActionRequest, BiddingActionResponse,
  BidParticipationRequest, BidParticipationResponse,
  MonsterAdditionRequest, MonsterAdditionResponse,
  EquipmentRemovalRequest, EquipmentRemovalResponse
} from './game-mechanics/bidding-interactions';
import { Raid } from './game-mechanics/raid';
import { RaidParticipants } from './game-mechanics/raid-participants';
import { Encounter } from './game-mechanics/encounter';
import { ChosenWeapon } from './game-mechanics/encounter';
import { RaidResult } from './game-mechanics/raid-result';

export { 
  Game, 
  Bidding, BiddingPlayersRound, 
  BiddingActionRequest, BiddingActionResponse,
  BidParticipationRequest, BidParticipationResponse,
  MonsterAdditionRequest, MonsterAdditionResponse,
  EquipmentRemovalRequest, EquipmentRemovalResponse,
  Raid, RaidParticipants, Encounter, ChosenWeapon, RaidResult 
}

// PLAYER
import { Player } from "./player/player";
import { PlayerRequirements } from "./player/player-requirements";

export { Player, PlayerRequirements }

// HERO
import { Hero } from "./hero/hero";

export { Hero }

// EQUIPMENT
import { Equipment } from './equipment/equipment';
import { EquipmentName } from './equipment/equipment-name';
import { equipmentNames } from './equipment/equipment-name';
import { WeaponName } from './equipment/equipment-name';
import { weaponNames } from './equipment/equipment-name';

export { Equipment, EquipmentName, equipmentNames, WeaponName, weaponNames }

// MONSTER
import { Monster } from './monster/monster';
import { MonsterType } from './monster/monster-type';
import { monsterTypes } from './monster/monster-type';
import { monsterData } from './monster/monster-data';

export { Monster, MonsterType, monsterTypes, monsterData }

// STATE
import { StateUpdate } from './state/state-update';

export { StateUpdate }
