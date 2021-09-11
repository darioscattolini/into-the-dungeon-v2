import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { MonsterAdditionComponent } from './monster-addition.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MonsterAdditionRequest } from '../../../models/models';
import { HeroDouble, MonsterDouble } from '../../../models/test-doubles';

describe('MonsterAdditionComponent', () => {
  let component: MockedDebugElement<MonsterAdditionComponent>;
  let dialogDataDummy: MonsterAdditionRequest['content'];
  
  beforeEach(() => MockBuilder(MonsterAdditionComponent, OneDeviceModule));

  beforeEach(() => {
    dialogDataDummy = {
      player: 'John Myturn',
      monster: MonsterDouble.createViewDataDouble(),
      state: {
        dungeon: [
          MonsterDouble.createViewDataDouble(),
          MonsterDouble.createViewDataDouble()
        ],
        hero: HeroDouble.createPlayingHeroViewDataDouble(),
        remainingMonsters: 5,
        remainingPlayers: 3
      }
    }

    MockRender(MonsterAdditionComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogDataDummy
        }
      ]
    });

    component = ngMocks.find(MonsterAdditionComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
