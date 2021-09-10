import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { PlayerRecorderComponent } from './player-recorder.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayersRequest } from '../../../models/models';
import { PlayerDouble } from '../../../models/test-doubles';

describe('PlayerRecorderComponent', () => {
  let component: MockedDebugElement<PlayerRecorderComponent>;
  let dialogDataDummy: PlayersRequest['content'];

  beforeEach(() => MockBuilder(PlayerRecorderComponent, OneDeviceModule));

  beforeEach(() => {
    const requirements = PlayerDouble.buildRequirementsDouble();
    dialogDataDummy = { range: [requirements.min, requirements.max] };
        
    MockRender(PlayerRecorderComponent, {}, {
      providers: [{
        provide: MAT_DIALOG_DATA,
        useValue: dialogDataDummy
      }]
    });

    component = ngMocks.find(PlayerRecorderComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/**
 * Tests from PlayersService:
 * -It is created
 * -Players amount within range
 * -Name uniqueness: disables addition, notifies error, returned names are unique
 * -Return arrays of strings, expected length and expected names
 */
