import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { 
  ForcibleMonsterAdditionComponent 
} from './forcible-monster-addition.component';
import { OneDeviceModule } from '../../one-device.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForcibleMonsterAdditionNotification } from '../../../models/models';
import { MonsterDouble } from '../../../models/test-doubles';

describe('ForcibleMonsterAdditionComponent', () => {
  let component: MockedDebugElement<ForcibleMonsterAdditionComponent>;
  let dialogDataDummy: ForcibleMonsterAdditionNotification['content'];
  
  beforeEach(
    () => MockBuilder(ForcibleMonsterAdditionComponent, OneDeviceModule)
  );

  beforeEach(() => {
    dialogDataDummy = {
      player: 'John Myturn',
      monster: MonsterDouble.createViewDataDouble()
    };

    MockRender(ForcibleMonsterAdditionComponent, {}, {
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogDataDummy
        }
      ]
    });

    component = ngMocks.find(ForcibleMonsterAdditionComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
