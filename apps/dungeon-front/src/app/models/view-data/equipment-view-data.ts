import { EquipmentName } from '../../models/models';

export interface EquipmentViewData {
  readonly name: EquipmentName;
  readonly image: string;
  readonly description: string;
}
