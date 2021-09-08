import { 
  MockBuilder, MockedDebugElement, MockRender, MockService, ngMocks 
} from 'ng-mocks';

import { 
  ForcibleMonsterAdditionComponent 
} from './forcible-monster-addition.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Notification } from '../../../models/models';

describe('ForcibleMonsterAdditionComponent', () => {
  let component: MockedDebugElement<ForcibleMonsterAdditionComponent>;
  
  beforeEach(
    () => MockBuilder(ForcibleMonsterAdditionComponent, OneDeviceModule)
  );

  beforeEach(() => {
    MockRender(ForcibleMonsterAdditionComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { request: MockService(Notification) }
        }
      ]
    });

    component = ngMocks.find(ForcibleMonsterAdditionComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
