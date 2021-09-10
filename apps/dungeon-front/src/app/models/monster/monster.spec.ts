import { Monster, AnyMonster } from './monster';
import { MonsterType } from './monster-type';
import { MonsterDouble } from '../test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

describe('Monster', () => {
  let monster: AnyMonster;
  let typeDummy: MonsterType;
  let damageDummy: number;

  beforeEach(() => {
    [typeDummy] = MonsterDouble.pickTypes(1);
    damageDummy = randomInteger(10);
    monster = new Monster(typeDummy, damageDummy);
  });

  test('it is created', () => {
    expect(monster).toBeTruthy();
  });

  test('it is of type passed as constructor parameter', () => {
    expect(monster.type).toBe(typeDummy);
  });

  test('it has damage passed as constructor parameter', () => {
    expect(monster.damage).toBe(damageDummy);
  });

  test.each([
    -6, -2, -1, 0, 1, 2, 4
  ])('it throws error for negative damage (%i)', damageDummy => {
    if (damageDummy < 0) {
      expect(() => { new Monster(typeDummy, damageDummy); })
        .toThrowError('Damage value must be 0 or positive.');
    } else {
      expect(() => { new Monster(typeDummy, damageDummy); }).not.toThrowError();
    }
  });
});
