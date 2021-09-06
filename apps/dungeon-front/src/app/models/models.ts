// GAME MECHANICS
import { Game } from './game-mechanics/game';
import { PlayerRequirements } from "./game-mechanics/player-requirements";
import { Bidding } from './game-mechanics/bidding/bidding';
import { 
  BiddingPlayersRound 
} from "./game-mechanics/bidding/bidding-players-round";
import { BiddingStateViewData } from './game-mechanics/bidding/bidding-state';
import {
  BiddingActionRequestData, BiddingActionResponseContent,
  BidParticipationRequestData, BidParticipationResponseContent,
  MonsterAdditionRequestData, MonsterAdditionResponseContent,
  EquipmentRemovalRequestData, EquipmentRemovalResponseContent
} from './game-mechanics/bidding/bidding-action';
import { Raid } from './game-mechanics/raid/raid';
import { RaidParticipants } from './game-mechanics/raid/raid-participants';
import { Encounter, EncounterOutcome } from './game-mechanics/raid/encounter';
import { ChosenWeapon } from './game-mechanics/raid/encounter';
import { RaidResult } from './game-mechanics/raid/raid-result';

export { 
  Game, PlayerRequirements,
  Bidding, BiddingPlayersRound, BiddingStateViewData,
  BiddingActionRequestData, BiddingActionResponseContent,
  BidParticipationRequestData, BidParticipationResponseContent,
  MonsterAdditionRequestData, MonsterAdditionResponseContent,
  EquipmentRemovalRequestData, EquipmentRemovalResponseContent,
  Raid, RaidParticipants, Encounter, EncounterOutcome, ChosenWeapon, RaidResult 
}

// PLAYER
import { Player } from "./player/player";

export { Player }

// HERO
import { Hero } from "./hero/hero";
import { HeroType, heroTypes } from "./hero/hero-type";
import { HeroDataMap, HeroDataMapIT, heroDataMap } from "./hero/hero-data";
import { 
  AnyHeroViewData, PlayingHeroViewData,
  HeroViewDataMap, HeroViewDataMapIT, heroViewDataMap 
} from "./hero/hero-view-data";

export { 
  Hero, HeroType, heroTypes, HeroDataMap, HeroDataMapIT, heroDataMap, 
  AnyHeroViewData, PlayingHeroViewData,
  HeroViewDataMap, HeroViewDataMapIT, heroViewDataMap 
}

// EQUIPMENT
import { Equipment } from './equipment/equipment';
import { Protection } from './equipment/protection/protection';
import { Weapon } from './equipment/weapon/weapon';
import { WeaponEffects } from './equipment/weapon/weapon-effects';
import { 
  EquipmentName, equipmentNames,
  WeaponName, weaponNames, 
  ProtectionName, protectionNames
} from './equipment/equipment-name';
import { 
  EquipmentDataMap, EquipmentDataMapIT, equipmentDataMap 
} from './equipment/equipment-data';
import { 
  AnyEquipmentViewData,
  EquipmentViewDataMap, EquipmentViewDataMapIT, equipmentViewDataMap 
} from './equipment/equipment-view-data';

export { 
  Equipment, EquipmentName, equipmentNames, 
  Protection, ProtectionName, protectionNames,
  Weapon, WeaponName, weaponNames, WeaponEffects,
  EquipmentDataMap, EquipmentDataMapIT, equipmentDataMap,
  AnyEquipmentViewData, 
  EquipmentViewDataMap, EquipmentViewDataMapIT, equipmentViewDataMap
}

// MONSTER
import { Monster, AnyMonster } from './monster/monster';
import { 
  MonsterType, MonsterTypeSecret, monsterTypes 
} from './monster/monster-type';
import { 
  MonsterDataMap, MonsterDataMapIT, monsterDataMap 
} from './monster/monster-data';
import { 
  AnyMonsterViewData, 
  MonsterViewDataMap, MonsterViewDataMapIT, monsterViewDataMap 
} from './monster/monster-view-data';

export { 
  Monster, AnyMonster, MonsterType, MonsterTypeSecret, monsterTypes, 
  MonsterDataMap, MonsterDataMapIT, monsterDataMap,
  AnyMonsterViewData, 
  MonsterViewDataMap, MonsterViewDataMapIT, monsterViewDataMap 
}

// REQUEST
import { Request } from './request/request';
import { BidParticipationRequest } from './request/bid-participation-request';
import { PlayersRequest } from './request/players-request';
import { HeroChoiceRequest } from './request/hero-choice-request';

export { Request, BidParticipationRequest, PlayersRequest, HeroChoiceRequest }
