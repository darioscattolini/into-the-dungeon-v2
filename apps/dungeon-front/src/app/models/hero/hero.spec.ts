import { Hero } from './hero';
import { Equipment, EquipmentName } from '../models';
import { 
  buildEquipmentPackDouble, pickRandomEquipmentNames 
} from '../test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

describe('Hero', () => {
  let hero: Hero;

  describe('instantiation and initial state', () => {
    test('it is created', () => {
      hero = new Hero(5);
  
      expect(hero).toBeTruthy();
    });

    test.each([
      0, 1, 2, 3, 4, 5, 6
    ])('initial hitPoints equals constructor parameter (%i)', hitPoints => {
      hero = new Hero(hitPoints);
      
      expect(hero.hitPoints).toBe(hitPoints);
    });
  });

  describe('equipment mounting and discarding', () => {
    let equipment: Equipment[];
    let equipmentNames: EquipmentName[];

    beforeEach(() => {
      hero = new Hero(5);
      equipment = buildEquipmentPackDouble(3);
      equipmentNames = equipment.map(piece => piece.name);
      
      for (const piece of equipment) {
        hero.mountEquipmentPiece(piece);
      }
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
});
