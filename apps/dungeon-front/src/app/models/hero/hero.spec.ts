import { Hero } from './hero';
import { Equipment, EquipmentName } from '../models';
import { 
  buildEquipmentPackDouble, pickRandomEquipmentNames 
} from '../test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

describe('Hero', () => {
  let equipmentDummy: Equipment[];
  let hero: Hero;

  beforeEach(() => {
    equipmentDummy = buildEquipmentPackDouble(3);
  });

  test('it is created', () => {
    hero = new Hero(equipmentDummy);

    expect(hero).toBeTruthy();
  });

  test('getMountedEquipment returns original equipment names', () => {
    hero = new Hero(equipmentDummy);
    const mountedEquipment = hero.getMountedEquipment();
    const expectedNames = equipmentDummy.map(piece => piece.name);

    expect(mountedEquipment).toIncludeSameMembers(expectedNames);
  });

  test('discardEquipmentPiece removes selected equipment', () => {
    hero = new Hero(equipmentDummy);
    
    const discardedIndex = randomInteger(equipmentDummy.length, false);
    const discardedName = equipmentDummy[discardedIndex].name;
    const expectedNames = equipmentDummy
      .map(piece => piece.name)
      .filter(name => name !== discardedName);

    hero.discardEquipmentPiece(discardedName);
    
    const mountedEquipment = hero.getMountedEquipment();
    
    expect(mountedEquipment).toIncludeSameMembers(expectedNames);
  });

  test('discardEquipmentPiece throws error for non held piece', () => {
    hero = new Hero(equipmentDummy);
    
    const heldPiecesNames = equipmentDummy.map(piece => piece.name);
    let nonHeldPieceName: EquipmentName;
    
    do {
      [nonHeldPieceName] = pickRandomEquipmentNames(1);
    } while (heldPiecesNames.includes(nonHeldPieceName));

    expect(() => { hero.discardEquipmentPiece(nonHeldPieceName); })
      .toThrowError(`${nonHeldPieceName} not included in hero's equipment.`);
  });
});
