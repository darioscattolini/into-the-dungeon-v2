import {
  MockBuilder, MockedDebugElement, MockRender, MockService, ngMocks 
} from 'ng-mocks';
import { randomInteger } from '@into-the-dungeon/util-testing';

import { PlayerRecorderComponent } from './player-recorder.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayersRequest } from '../../../models/models';

describe('PlayerRecorderComponent', () => {
  let component: MockedDebugElement<PlayerRecorderComponent>;
  let playersRequestStub: PlayersRequest;
  let rangeDummy: [number, number];

  beforeEach(() => MockBuilder(PlayerRecorderComponent, OneDeviceModule));

  beforeEach(() => {
    playersRequestStub = MockService(PlayersRequest);
    const randomStart = 1 + randomInteger(2);
    const randomEnd = randomStart + 1 + randomInteger(2);
    rangeDummy = [randomStart, randomEnd];

    Object.defineProperty(playersRequestStub, 'range', { value: rangeDummy});
    
    MockRender(PlayerRecorderComponent, {}, {
      providers: [{
        provide: MAT_DIALOG_DATA,
        useValue: { request: playersRequestStub }
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
