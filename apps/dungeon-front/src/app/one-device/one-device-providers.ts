import { BiddingService } from './services/bidding.service';
import { EquipmentService } from './services/equipment.service';
import { GameService } from './services/game.service';
import { HeroesService } from './services/heroes.service';
import { MonstersService } from './services/monsters.service';
import { RaidService } from './services/raid.service';
import { UiMediatorService } from './services/ui-mediator.service';
import { 
  equipmentDataMap, EquipmentDataMapIT, 
  equipmentViewDataMap, EquipmentViewDataMapIT, 
  heroDataMap, HeroDataMapIT, heroViewDataMap, HeroViewDataMapIT, 
  monsterDataMap, MonsterDataMapIT, monsterViewDataMap, MonsterViewDataMapIT 
} from '../models/models';

export const oneDeviceModuleProviders = [
  BiddingService,
  EquipmentService,
  GameService,
  HeroesService,
  MonstersService,
  RaidService,
  UiMediatorService,
  { provide: EquipmentDataMapIT, useValue: equipmentDataMap },
  { provide: EquipmentViewDataMapIT, useValue: equipmentViewDataMap },
  { provide: HeroDataMapIT, useValue: heroDataMap },
  { provide: HeroViewDataMapIT, useValue: heroViewDataMap },
  { provide: MonsterDataMapIT, useValue: monsterDataMap },
  { provide: MonsterViewDataMapIT, useValue: monsterViewDataMap }
];
