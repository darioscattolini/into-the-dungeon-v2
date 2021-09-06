import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';
import { randomInteger, randomString } from '@into-the-dungeon/util-testing';

import { BiddingStateComponent } from './bidding-state.component';
import { OneDeviceModule } from '../../one-device.module';
import { AnyMonsterViewData, PlayingHeroViewData } from '../../../models/models';
import { buildEquipmentViewDataDummy } from '../../../models/test-doubles';

describe('BiddingStateComponent', () => {
  let component: MockedDebugElement<BiddingStateComponent>;
  let heroDummy: PlayingHeroViewData;
  let dungeonDummy: AnyMonsterViewData[];
  
  beforeEach(() => MockBuilder(BiddingStateComponent, OneDeviceModule));

  beforeEach(() => {
    heroDummy = {
      type: 'mage',
      image: '...',
      description: randomString(10),
      hitPoints: randomInteger(5),
      equipment: buildEquipmentViewDataDummy()
    };

    dungeonDummy = [];
    
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
