import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';
import { randomInteger } from '@into-the-dungeon/util-testing';

import { PlayerRecorderComponent } from './player-recorder.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayersRequest } from '../../../models/models';

describe('PlayerRecorderComponent', () => {
  let component: MockedDebugElement<PlayerRecorderComponent>;
  let dialogDataDummy: PlayersRequest['content'];

  beforeEach(() => MockBuilder(PlayerRecorderComponent, OneDeviceModule));

  beforeEach(() => {
    const randomStart = 1 + randomInteger(2);
    const randomEnd = randomStart + 1 + randomInteger(2);
    dialogDataDummy = {
      range: [randomStart, randomEnd]
    };
        
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
