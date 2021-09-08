import { 
  MockBuilder, MockedDebugElement, MockRender, MockService, ngMocks 
} from 'ng-mocks';

import { BiddingEndComponent } from './bidding-end.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Notification } from '../../../models/models';

describe('BiddingEndComponent', () => {
  let component: MockedDebugElement<BiddingEndComponent>;
  
  beforeEach(() => MockBuilder(BiddingEndComponent, OneDeviceModule));

  beforeEach(() => {
    MockRender(BiddingEndComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { request: MockService(Notification) }
        }
      ]
    });

    component = ngMocks.find(BiddingEndComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
