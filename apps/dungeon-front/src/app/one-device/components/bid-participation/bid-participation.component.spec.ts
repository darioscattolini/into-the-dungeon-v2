import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { BidParticipationComponent } from './bid-participation.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BidParticipationRequest } from '../../../models/models';
import { HeroDouble } from '../../../models/test-doubles';


describe('BidParticipationComponent', () => {
  let component: MockedDebugElement<BidParticipationComponent>;
  let dialogDataDummy: BidParticipationRequest['content'];
  
  beforeEach(() => MockBuilder(BidParticipationComponent, OneDeviceModule));

  beforeEach(() => {
    dialogDataDummy = {
      player: 'John Myturn',
      state: {
        dungeon: [],
        hero: HeroDouble.createPlayingHeroViewDataDouble(),
        remainingMonsters: 5,
        remainingPlayers: 3
      }
    }

    MockRender(BidParticipationComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogDataDummy
        }
      ]
    });

    component = ngMocks.find(BidParticipationComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
