import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { EquipmentViewComponent } from './equipment-view.component';
import { OneDeviceModule } from '../../one-device.module';
import { AnyEquipmentViewData } from '../../../models/models';

describe('EquipmentViewComponent', () => {
  let component: MockedDebugElement<EquipmentViewComponent>;
  let smallComponentDummy: boolean;
  let equipmentViewDataDummy: AnyEquipmentViewData;

  beforeEach(() => MockBuilder(EquipmentViewComponent, OneDeviceModule));

  beforeEach(() => {
    smallComponentDummy = false;
    equipmentViewDataDummy = {
      name: 'chaperone',
      type: 'protection',
      description: 'blablabla',
      image: '...',
      hitPoints: 4
    };

    MockRender(EquipmentViewComponent, {
      'smallComponent': smallComponentDummy,
      'piece': equipmentViewDataDummy
    });

    component = ngMocks.find(EquipmentViewComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
