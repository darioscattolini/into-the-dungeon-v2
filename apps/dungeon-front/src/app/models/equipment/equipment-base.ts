import { ProtectionName, WeaponName } from './equipment-name';

export interface EquipmentBase<T extends 'protection' | 'weapon'> {
  type: T;
  name: T extends 'protection' ? ProtectionName : WeaponName;
}
