import { 
  MockBuilder, MockedDebugElement, MockRender, MockService, ngMocks 
} from 'ng-mocks';

import { BidParticipationComponent } from './bid-participation.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BidParticipationRequest } from '../../../models/models';


describe('BidParticipationComponent', () => {
  let component: MockedDebugElement<BidParticipationComponent>;
  
  beforeEach(() => MockBuilder(BidParticipationComponent, OneDeviceModule));

  beforeEach(() => {
    MockRender(BidParticipationComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { request: MockService(BidParticipationRequest) }
        }
      ]
    });

    component = ngMocks.find(BidParticipationComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
