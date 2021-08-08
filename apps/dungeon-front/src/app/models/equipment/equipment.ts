import { EquipmentName } from "./equipment-name";

export class Equipment {
  public readonly name: EquipmentName;

  constructor(name: EquipmentName) {
    this.name = name;
  }
}
