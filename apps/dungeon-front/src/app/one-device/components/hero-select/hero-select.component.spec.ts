import {
  MockBuilder, MockedDebugElement, MockRender, MockService, ngMocks 
} from 'ng-mocks';

import { HeroSelectComponent } from './hero-select.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeroChoiceRequest } from '../../../models/models';

describe('HeroSelectComponent', () => {
  let component: MockedDebugElement<HeroSelectComponent>;
  let playerNameDummy: string;

  beforeEach(() => MockBuilder(HeroSelectComponent, OneDeviceModule));

  beforeEach(() => {
    playerNameDummy = 'John';

    MockRender(HeroSelectComponent, {
      player: playerNameDummy,
    }, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { request: MockService(HeroChoiceRequest) }
        }
      ]
    });

    component = ngMocks.find(HeroSelectComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
