import { Injectable, Inject } from '@angular/core';
import {
  Equipment,
  EquipmentName,
  EquipmentDataMap,
  EquipmentDataMapIT,
  EquipmentViewDataMap,
  EquipmentViewDataMapIT,
  Protection,
  ProtectionName,
  protectionNames,
  Weapon,
  WeaponName,
  weaponNames
} from '../../models/models';

type EquipmentConditional<T extends EquipmentName> = T extends ProtectionName
  ? Protection
  : T extends WeaponName
  ? Weapon
  : never;

@Injectable()
export class EquipmentService {
  private data: EquipmentDataMap;
  private viewData: EquipmentViewDataMap;

  constructor(
    @Inject(EquipmentDataMapIT) equipmentDataMap: EquipmentDataMap,
    @Inject(EquipmentViewDataMapIT) equipmentViewDataMap: EquipmentViewDataMap
  ) {
    this.data = equipmentDataMap;
    this.viewData = equipmentViewDataMap;
  }

  public createPiece<T extends EquipmentName>(
    pieceName: T
  ): EquipmentConditional<T> {
    let piece: EquipmentConditional<T>;
    const pieceType = this.getEquipmentPieceType(pieceName);

    if (pieceType === 'weapon') {
      const _name = pieceName as WeaponName;
      const _Weapon = this.data[_name].classToBeUsed;
      const uses = this.data[_name].availableUses;
      const effects = this.data[_name].effects;
      piece = new _Weapon(_name, uses, effects) as EquipmentConditional<T>;
    } else {
      const _name = pieceName as ProtectionName;
      const _Protection = this.data[_name].classToBeUsed;
      const hitPoints = this.data[_name].hitPoints;
      piece = new _Protection(_name, hitPoints) as EquipmentConditional<T>;
    }

    return piece;
  }

  public getViewDataFor<T extends EquipmentName>(
    pieceName: T
  ): EquipmentViewDataMap[T] {
    return this.viewData[pieceName];
  }

  private getEquipmentPieceType(pieceName: EquipmentName): Equipment['type'] {
    // Type manipulation needed because of Array.includes() 
    // narrow constraints on parameter
    const weaponNamesList: EquipmentName[] = [...weaponNames];
    const protectionNamesList: EquipmentName[] = [...protectionNames];
    let pieceType: Equipment['type'];

    if (weaponNamesList.includes(pieceName)) {
      pieceType = 'weapon';
    } else if (protectionNamesList.includes(pieceName)) {
      pieceType = 'protection';
    } else {
      throw new Error(
        `${pieceName} not included in weapon nor protection names array.`
      );
    }

    return pieceType;
  }
}
