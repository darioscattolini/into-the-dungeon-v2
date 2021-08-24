import { Equipment } from './equipment';
import { ProtectionName } from './equipment-name';

export class Protection extends Equipment {
  public readonly hitPoints: number;
  public readonly name: ProtectionName;
  
  constructor(name: ProtectionName, hitPoints: number) {
    super();
    this.name = name;
    this.hitPoints = hitPoints;
  }
}
