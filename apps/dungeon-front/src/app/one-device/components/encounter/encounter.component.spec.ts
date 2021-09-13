import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { EncounterComponent } from './encounter.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EncounterResolutionRequest } from '../../../models/models';
import { 
  HeroDouble, 
  MonsterDouble, 
  WeaponDouble 
} from '../../../models/test-doubles';

describe('EncounterComponent', () => {
  let component: MockedDebugElement<EncounterComponent>;
  let dialogDataDummy: EncounterResolutionRequest['content'];
  
  beforeEach(() => MockBuilder(EncounterComponent, OneDeviceModule));

  beforeEach(() => {
    dialogDataDummy = {
      player: 'John Raider',
      encounter: {
        enemy: MonsterDouble.createViewDataDouble(),
        weapons: [ WeaponDouble.buildViewDataDummy() ]
      },
      state: {
        hero: HeroDouble.createPlayingHeroViewDataDouble(),
        remainingEnemies: 5
      }
    }

    MockRender(EncounterComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogDataDummy
        }
      ]
    });

    component = ngMocks.find(EncounterComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
