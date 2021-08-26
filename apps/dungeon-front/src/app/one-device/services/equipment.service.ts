import { Injectable } from '@angular/core';
import { OneDeviceModule } from '../one-device.module';
import { 
  Equipment, EquipmentName, Protection, EquipmentViewData 
} from '../../models/models';

@Injectable({
  providedIn: OneDeviceModule
})
export class EquipmentService {
  public createPiece(equipmentName: EquipmentName): Equipment {
    // minimum required implementation
    return new Protection('chaperone', 3);
  }

  public getViewDataFor(equipmentName: EquipmentName): EquipmentViewData {
    // minimum required implementation
    return {
      name: 'elfish harp',
      description: 'blabla',
      image: 'blabla'
    };
  }
}
