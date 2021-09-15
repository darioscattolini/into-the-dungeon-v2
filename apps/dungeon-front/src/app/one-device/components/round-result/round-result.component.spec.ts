
import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { RoundResultComponent } from './round-result.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoundResultNotification } from '../../../models/models';

describe('RoundResultComponent', () => {
  let component: MockedDebugElement<RoundResultComponent>;
  let dialogDataDummy: RoundResultNotification['content'];
  
  beforeEach(
    () => MockBuilder(RoundResultComponent, OneDeviceModule)
  );

  beforeEach(() => {
    dialogDataDummy = {
      points: [],
    };

    MockRender(RoundResultComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogDataDummy
        }
      ]
    });

    component = ngMocks.find(RoundResultComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
