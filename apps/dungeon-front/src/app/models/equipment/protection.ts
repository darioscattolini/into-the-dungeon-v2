import { Equipment } from './equipment';
import { ProtectionName } from './equipment-name';

export class Protection extends Equipment {
  public readonly name: ProtectionName;
  
  constructor(name: ProtectionName) {
    super();
    this.name = name;
  }
}
