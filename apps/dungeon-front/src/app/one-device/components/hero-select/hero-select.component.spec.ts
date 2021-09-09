import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { HeroSelectComponent } from './hero-select.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeroChoiceRequest } from '../../../models/models';
import { HeroDouble } from '../../../models/test-doubles';

describe('HeroSelectComponent', () => {
  let component: MockedDebugElement<HeroSelectComponent>;
  let dialogDataDummy: HeroChoiceRequest['content'];

  beforeEach(() => MockBuilder(HeroSelectComponent, OneDeviceModule));

  beforeEach(() => {
    dialogDataDummy = {
      player: 'John Myturn',
      options: [
        HeroDouble.createStartingHeroViewDataDouble(),
        HeroDouble.createStartingHeroViewDataDouble(),
      ]
    };

    MockRender(HeroSelectComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogDataDummy
        }
      ]
    });

    component = ngMocks.find(HeroSelectComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
