import { Hero } from './hero';
import { Equipment, EquipmentName } from '../models';
import { 
  buildEquipmentPackDouble, pickRandomEquipmentNames 
} from '../test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

describe('Hero', () => {
  let hero: Hero;
  let equipment: Equipment[];
  let equipmentNames: EquipmentName[];

  beforeEach(() => {
    hero = new Hero();
    equipment = buildEquipmentPackDouble(3);
    equipmentNames = equipment.map(piece => piece.name);
    
    for (const piece of equipment) {
      hero.mountEquipmentPiece(piece);
    }
  });

  test('it is created', () => {
    hero = new Hero();

    expect(hero).toBeTruthy();
  });

  test('getMountedEquipment returns mounted equipment names', () => {
    const returnedEquipmentNames = hero.getMountedEquipment();

    expect(returnedEquipmentNames).toIncludeSameMembers(equipmentNames);
  });

  test('discardEquipmentPiece removes selected equipment', () => {
    const discardedIndex = randomInteger(equipment.length, false);
    const discardedName = equipment[discardedIndex].name;
    const expectedNames = equipmentNames
      .filter(name => name !== discardedName);

    hero.discardEquipmentPiece(discardedName);
    
    const returnedEquipment = hero.getMountedEquipment();
    
    expect(returnedEquipment).toIncludeSameMembers(expectedNames);
  });

  test('discardEquipmentPiece throws error for non held piece', () => {
    let nonHeldPieceName: EquipmentName;
    
    do {
      [nonHeldPieceName] = pickRandomEquipmentNames(1);
    } while (equipmentNames.includes(nonHeldPieceName));

    expect(() => { hero.discardEquipmentPiece(nonHeldPieceName); })
      .toThrowError(`${nonHeldPieceName} not included in hero's equipment.`);
  });
});
