import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { BiddingEndComponent } from './bidding-end.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BiddingEndNotification } from '../../../models/models';

describe('BiddingEndComponent', () => {
  let component: MockedDebugElement<BiddingEndComponent>;
  let dialogDataDummy: BiddingEndNotification['content'];
  
  beforeEach(() => MockBuilder(BiddingEndComponent, OneDeviceModule));

  beforeEach(() => {
    dialogDataDummy = {
      endReason: 'last-bidding-player',
      raider: 'John Raider'
    }

    MockRender(BiddingEndComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogDataDummy
        }
      ]
    });

    component = ngMocks.find(BiddingEndComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
