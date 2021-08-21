import { Equipment, EquipmentName } from '../models';

export class Hero {
  private equipment: Equipment[];

  constructor(equipment: Equipment[]) {
    this.equipment = Array.from(equipment);
  }

  public discardEquipmentPiece(pieceName: EquipmentName): void {
    const pieceIndex = this.equipment
      .findIndex(piece => piece.name === pieceName);
    
    if (pieceIndex >= 0) {
      this.equipment.splice(pieceIndex, 1);
    } else {
      throw new Error(`${pieceName} not included in hero's equipment.`)
    }
  }

  public getMountedEquipment(): EquipmentName[] {
    return this.equipment.map(piece => piece.name);
  }
}
