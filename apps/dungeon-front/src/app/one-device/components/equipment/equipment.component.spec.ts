import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { EquipmentComponent } from './equipment.component';
import { OneDeviceModule } from '../../one-device.module';
import { AnyEquipmentViewData } from '../../../models/models';

describe('EquipmentViewComponent', () => {
  let component: MockedDebugElement<EquipmentComponent>;
  let smallComponentDummy: boolean;
  let equipmentViewDataDummy: AnyEquipmentViewData;

  beforeEach(() => MockBuilder(EquipmentComponent, OneDeviceModule));

  beforeEach(() => {
    smallComponentDummy = false;
    equipmentViewDataDummy = {
      name: 'chaperone',
      type: 'protection',
      description: 'blablabla',
      image: '...',
      hitPoints: 4
    };

    MockRender(EquipmentComponent, {
      'smallComponent': smallComponentDummy,
      'piece': equipmentViewDataDummy
    });

    component = ngMocks.find(EquipmentComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
