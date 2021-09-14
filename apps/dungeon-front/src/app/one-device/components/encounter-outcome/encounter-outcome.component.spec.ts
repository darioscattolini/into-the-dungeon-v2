import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { EncounterOutcomeComponent } from './encounter-outcome.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EncounterOutcomeNotification } from '../../../models/models';

describe('EncounterOutcomeComponent', () => {
  let component: MockedDebugElement<EncounterOutcomeComponent>;
  let dialogDataDummy: EncounterOutcomeNotification['content'];
  
  beforeEach(
    () => MockBuilder(EncounterOutcomeComponent, OneDeviceModule)
  );

  beforeEach(() => {
    dialogDataDummy = {
      player: 'John Raider',
      hitPoints: {
        total: 7,
        change: -3
      }
    };

    MockRender(EncounterOutcomeComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogDataDummy
        }
      ]
    });

    component = ngMocks.find(EncounterOutcomeComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
