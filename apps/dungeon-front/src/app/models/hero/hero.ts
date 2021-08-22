import { 
  Equipment, EquipmentName, WeaponName, Monster, EncounterOutcome
} from '../models';

export class Hero {
  public get hitPoints() { return this._hitPoints; }
  private _hitPoints: number;

  private equipment: Equipment[] = [];

  constructor(baseHitPoints: number) {
    this._hitPoints = baseHitPoints;
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

  public getWeaponsAgainst(enemy: Monster): WeaponName[] {
    // minimum required implementation
    return [];
  }

  public getMountedEquipment(): EquipmentName[] {
    return this.equipment.map(piece => piece.name);
  }

  public mountEquipmentPiece(piece: Equipment): void {
    this.equipment.push(piece);
  }

  public takeDamageFrom(enemy: Monster): EncounterOutcome {
    // minimum required implementation
    return { hitPointsChange: -2 };
  }

  public useWeaponAgainst(weapon: WeaponName, enemy: Monster): EncounterOutcome {
    // minimum required implementation
    // hitpoint change and weapon discarded here
    return { hitPointsChange: -2 };
  }
}
