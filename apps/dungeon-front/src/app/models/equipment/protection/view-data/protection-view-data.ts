import { ProtectionName } from '../../equipment-name';
import { BaseEquipmentViewData } from '../../equipment-view-data';

export interface ProtectionViewData<T extends ProtectionName> 
  extends BaseEquipmentViewData<T> {
    readonly name: T;
    readonly type: 'protection';
    readonly hitPoints: number;
}
