// BARD
const bardProtectionNames = ['big plumed hat', 'fancy tunic',] as const;

const bardWeaponNames = [ 
  'eardrum smasher', 'charming flute', 'dancing sword', 'coin of luck'
] as const;

const bardEquipmentNames = [
  ...bardProtectionNames, ...bardWeaponNames
] as const;

type BardProtectionName = typeof bardProtectionNames[number];
type BardWeaponName = typeof bardWeaponNames[number];
type BardEquipmentName = BardProtectionName | BardWeaponName;

// MAGE
const mageProtectionNames = ['zombie companion', 'evil cape'] as const;

const mageWeaponNames = [
  'blasting spell', 'dark stone', 'wand of blood', 'power drainer'
] as const;

const mageEquipmentNames = [
  ...mageProtectionNames, ...mageWeaponNames
] as const;

type MageProtectionName = typeof mageProtectionNames[number];
type MageWeaponName = typeof mageWeaponNames[number];
type MageEquipmentName = MageProtectionName | MageWeaponName;

// NINJA
const ninjaProtectionNames = ['energetic potion', 'healing herbs'] as const;

const ninjaWeaponNames = [
  'wooden shuriken', 'katana', 'smoke bomb', 'ninja pack'
] as const;

const ninjaEquipmentNames = [
  ...ninjaProtectionNames, ...ninjaWeaponNames
] as const;

type NinjaProtectionName = typeof ninjaProtectionNames[number];
type NinjaWeaponName = typeof ninjaWeaponNames[number];
type NinjaEquipmentName = NinjaProtectionName | NinjaWeaponName;

// PRINCESS
const princessProtectionNames = ['suitor', 'chaperone'] as const;

const princessWeaponNames = [
  'dragon collar', 'ancient crown', 'royal sceptre', 'broad sword',
] as const;

const princessEquipmentNames = [
  ...princessProtectionNames, ...princessWeaponNames
] as const;

type PrincessProtectionName = typeof princessProtectionNames[number];
type PrincessWeaponName = typeof princessWeaponNames[number];
type PrincessEquipmentName = PrincessProtectionName | PrincessWeaponName;

export type ProtectionName =
  | BardProtectionName
  | MageProtectionName
  | NinjaProtectionName
  | PrincessProtectionName;

export const protectionNames = [
  ...bardProtectionNames, 
  ...mageProtectionNames, 
  ...ninjaProtectionNames, 
  ...princessProtectionNames
] as const;

export type WeaponName =
  | BardWeaponName
  | MageWeaponName
  | NinjaWeaponName
  | PrincessWeaponName;

export const weaponNames = [
  ...bardWeaponNames, 
  ...mageWeaponNames, 
  ...ninjaWeaponNames, 
  ...princessWeaponNames
] as const;

export type EquipmentName = ProtectionName | WeaponName;

export const equipmentNames = [
  ...bardEquipmentNames, 
  ...mageEquipmentNames, 
  ...ninjaEquipmentNames,
  ...princessEquipmentNames
] as const;
