import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { MonsterComponent } from './monster.component';
import { OneDeviceModule } from '../../one-device.module';
import { AnyMonsterViewData } from '../../../models/models';

describe('MonsterComponent', () => {
  let component: MockedDebugElement<MonsterComponent>;
  let monsterViewDataDummy: AnyMonsterViewData;

  beforeEach(() => MockBuilder(MonsterComponent, OneDeviceModule));

  beforeEach(() => {
    monsterViewDataDummy = {
      name: 'fairy',
      damage: 3,
      description: '......',
      image: '...'
    };

    MockRender(MonsterComponent, {
      'monster': monsterViewDataDummy
    });

    component = ngMocks.find(MonsterComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
