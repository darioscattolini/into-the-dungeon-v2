import { EquipmentBase } from '../equipment-base';
import { ProtectionName } from '../equipment-name';

export class Protection implements EquipmentBase<'protection'> {
  public readonly hitPoints: number;
  public readonly name: ProtectionName;
  public readonly type = 'protection';
  
  constructor(name: ProtectionName, hitPoints: number) {
    this.name = name;
    this.hitPoints = hitPoints;
  }
}
