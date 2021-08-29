import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OneDeviceRoutingModule } from './one-device-routing.module';
import { OneDeviceComponent } from './one-device.component';
import { BiddingService } from './services/bidding.service';
import { EquipmentService } from './services/equipment.service';
import { GameService } from './services/game.service';
import { HeroesService } from './services/heroes.service';
import { MonstersService } from './services/monsters.service';
import { PlayersService } from './services/players.service';
import { RaidService } from './services/raid.service';
import { UiMediatorService } from './services/ui-mediator.service';
import { 
  equipmentDataMap, EquipmentDataMapIT, 
  equipmentViewDataMap, EquipmentViewDataMapIT, 
  heroDataMap, HeroDataMapIT, heroViewDataMap, HeroViewDataMapIT, 
  monsterDataMap, MonsterDataMapIT, monsterViewDataMap, MonsterViewDataMapIT 
} from '../models/models';


@NgModule({
  declarations: [OneDeviceComponent],
  imports: [
    CommonModule,
    OneDeviceRoutingModule
  ],
  providers: [
    BiddingService,
    EquipmentService,
    GameService,
    HeroesService,
    MonstersService,
    PlayersService,
    RaidService,
    UiMediatorService,
    { provide: EquipmentDataMapIT, useValue: equipmentDataMap },
    { provide: EquipmentViewDataMapIT, useValue: equipmentViewDataMap },
    { provide: HeroDataMapIT, useValue: heroDataMap },
    { provide: HeroViewDataMapIT, useValue: heroViewDataMap },
    { provide: MonsterDataMapIT, useValue: monsterDataMap },
    { provide: MonsterViewDataMapIT, useValue: monsterViewDataMap }
  ]
})
export class OneDeviceModule { }
