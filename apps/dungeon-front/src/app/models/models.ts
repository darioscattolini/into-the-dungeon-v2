// GAME MECHANICS
import { Game } from './game-mechanics/game';
import { PlayerRequirements } from "./game-mechanics/player-requirements";
import { Bidding } from './game-mechanics/bidding/bidding';
import { 
  BiddingPlayersRound 
} from "./game-mechanics/bidding/bidding-players-round";
import {
  BiddingAction,
  BiddingActionRequest, BiddingActionResponse,
  BidParticipationRequest, BidParticipationResponse,
  MonsterAdditionRequest, MonsterAdditionResponse,
  EquipmentRemovalRequest, EquipmentRemovalResponse
} from './game-mechanics/bidding/bidding-action';
import { Raid } from './game-mechanics/raid/raid';
import { RaidParticipants } from './game-mechanics/raid/raid-participants';
import { Encounter, EncounterOutcome } from './game-mechanics/raid/encounter';
import { ChosenWeapon } from './game-mechanics/raid/encounter';
import { RaidResult } from './game-mechanics/raid/raid-result';

export { 
  Game, PlayerRequirements,
  Bidding, BiddingPlayersRound, BiddingAction,
  BiddingActionRequest, BiddingActionResponse,
  BidParticipationRequest, BidParticipationResponse,
  MonsterAdditionRequest, MonsterAdditionResponse,
  EquipmentRemovalRequest, EquipmentRemovalResponse,
  Raid, RaidParticipants, Encounter, EncounterOutcome, ChosenWeapon, RaidResult 
}

// PLAYER
import { Player } from "./player/player";

export { Player }

// HERO
import { Hero } from "./hero/hero";
import { HeroType, heroTypes } from "./hero/hero-type";
import { HeroData, heroData, HeroDataIT } from "./hero/hero-data";

export { Hero, HeroType, heroTypes, HeroData, heroData, HeroDataIT }

// EQUIPMENT
import { Equipment } from './equipment/equipment';
import { Protection } from './equipment/protection';
import { Weapon } from './equipment/weapon';
import { 
  EquipmentName, equipmentNames,
  WeaponName, weaponNames, 
  ProtectionName, protectionNames
} from './equipment/equipment-name';

export { 
  Equipment, EquipmentName, equipmentNames,
  Protection, ProtectionName, protectionNames,
  Weapon, WeaponName, weaponNames
}

// MONSTER
import { Monster, AnyMonster } from './monster/monster';
import { MonsterType, monsterTypes } from './monster/monster-type';
import { monsterData } from './monster/monster-data';

export { Monster, AnyMonster, MonsterType, monsterTypes, monsterData }

// VIEW DATA
import { 
  HeroViewData, AnyHeroViewData, PartialHeroViewData 
} from './view-data/hero-view-data';
import { EquipmentViewData } from './view-data/equipment-view-data';

export { HeroViewData, AnyHeroViewData, PartialHeroViewData, EquipmentViewData };
