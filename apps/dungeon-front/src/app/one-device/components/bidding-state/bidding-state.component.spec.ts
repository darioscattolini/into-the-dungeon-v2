import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { BiddingStateComponent } from './bidding-state.component';
import { OneDeviceModule } from '../../one-device.module';
import { AnyMonsterViewData, PlayingHeroViewData } from '../../../models/models';
import { HeroDouble, MonsterDouble } from '../../../models/test-doubles';

describe('BiddingStateComponent', () => {
  let component: MockedDebugElement<BiddingStateComponent>;
  let heroDummy: PlayingHeroViewData;
  let dungeonDummy: AnyMonsterViewData[];
  
  beforeEach(() => MockBuilder(BiddingStateComponent, OneDeviceModule));

  beforeEach(() => {
    heroDummy = HeroDouble.createPlayingHeroViewDataDouble();

    dungeonDummy = [
      MonsterDouble.createViewDataDouble(),
      MonsterDouble.createViewDataDouble()
    ];
    
    MockRender(BiddingStateComponent, {
      hero: heroDummy,
      dungeon: dungeonDummy
    });

    component = ngMocks.find(BiddingStateComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
