import { HeroType } from './hero-type';
import { 
  Equipment, EquipmentName, Protection, Weapon, WeaponName, 
  AnyMonster, EncounterOutcome
} from '../models';

export class Hero {
  public get hitPoints() { return this._hitPoints; }
  private _hitPoints: number;

  public readonly type: HeroType;

  private protection: Protection[] = [];
  private ready = false;
  private weapons: Weapon[] = [];

  constructor(type: HeroType, baseHitPoints: number) {
    this.type = type;
    this._hitPoints = baseHitPoints;
  }

  public discardEquipmentPiece(pieceName: EquipmentName): void {
    this.checkIfReady();

    let pieceIndex = this.protection
      .findIndex(piece => piece.name === pieceName);
    
    if (pieceIndex >= 0) {
      const [piece] = this.protection.splice(pieceIndex, 1);
      this._hitPoints -= piece.hitPoints;
    } else {
      pieceIndex = this.weapons
        .findIndex(piece => piece.name === pieceName);

      if (pieceIndex >= 0) {
        this.weapons.splice(pieceIndex, 1);
      } else {
        throw new Error(`${pieceName} not included in hero's equipment.`);
      }
    }
  }

  public getWeaponsAgainst(enemy: AnyMonster): WeaponName[] {
    this.checkIfReady();

    const usefulWeapons = this.weapons
      .filter(weapon => weapon.isUsefulAgainst(enemy))
      .map(weapon => weapon.name);

    return usefulWeapons;
  }

  public getMountedEquipment(): EquipmentName[] {
    const mountedEquipment = this.getAllEquipment();
    
    return mountedEquipment.map(piece => piece.name);
  }

  public mountEquipmentPiece(piece: Equipment): void {
    if (this.ready) {
      throw new Error('Hero is ready. New equipment mounting not allowed.');
    }

    if (this.getMountedEquipment().includes(piece.name)) {
      throw new Error(`Hero has already mounted a piece of ${piece.name}.`);
    }

    if (piece.type === 'protection') {
      this.protection.push(piece);
      this._hitPoints += piece.hitPoints;
    } else {
      this.weapons.push(piece);
    }

    if (this.getAllEquipment().length === 6) {
      this.ready = true;
    }
  }

  public takeDamageFrom(enemy: AnyMonster): EncounterOutcome {
    this.checkIfReady();

    const damage = enemy.damage;
    this._hitPoints = Math.max(0, this._hitPoints - damage);

    return { hitPointsChange: - damage };
  }

  public useWeaponAgainst(
    weaponName: WeaponName, enemy: AnyMonster
  ): EncounterOutcome {
    this.checkIfReady();

    const weapon = this.weapons.find(weapon => weapon.name === weaponName);
    
    if (!weapon) {
      throw new Error(`${weaponName} not included in hero's equipment.`);
    }
    
    const hitPointsChange = weapon.useAgainst(enemy);
    this._hitPoints = Math.max(0, this._hitPoints + hitPointsChange);
    
    let discardedWeapon;
    
    if (weapon.availableUses === 0) {
      discardedWeapon = weaponName;
      this.discardEquipmentPiece(discardedWeapon);
    }

    return { hitPointsChange, discardedWeapon };
  }

  private getAllEquipment(): Equipment[] {
    return [...this.protection, ...this.weapons];
  }

  private checkIfReady(): void {
    if (!this.ready) {
      throw new Error ('Mount 6 equipment pieces before using Hero.')
    }
  }
}
