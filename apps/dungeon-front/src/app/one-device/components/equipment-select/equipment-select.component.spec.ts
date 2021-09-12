import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { EquipmentSelectComponent } from './equipment-select.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EquipmentRemovalRequest } from '../../../models/models';
import { HeroDouble, MonsterDouble } from '../../../models/test-doubles';

describe('EquipmentSelectComponent', () => {
  let component: MockedDebugElement<EquipmentSelectComponent>;
  let dialogDataDummy: EquipmentRemovalRequest['content'];

  beforeEach(() => MockBuilder(EquipmentSelectComponent, OneDeviceModule));

  beforeEach(() => {
    dialogDataDummy = {
      player: 'John Myturn',
      state: {
        dungeon: [
          MonsterDouble.createViewDataDouble(),
          MonsterDouble.createViewDataDouble()
        ],
        hero: HeroDouble.createPlayingHeroViewDataDouble(),
        remainingMonsters: 5,
        remainingPlayers: 3
      }
    };

    MockRender(EquipmentSelectComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogDataDummy
        }
      ]
    });

    component = ngMocks.find(EquipmentSelectComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
