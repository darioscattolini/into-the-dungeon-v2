import { Protection } from './protection';
import { ProtectionName } from './equipment-name';
import { pickRandomProtectionNames } from '../test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

describe('Protection', () => {
  let protection: Protection;
  let nameDummy: ProtectionName;
  let hitPointsDummy: number;

  beforeEach(() => {
    [nameDummy] = pickRandomProtectionNames(1);
    hitPointsDummy = randomInteger(7);
    protection = new Protection(nameDummy, hitPointsDummy);
  });

  test('it is created', () => {
    expect(protection).toBeTruthy();
  });

  test('it is of type Protection', () => {
    expect(protection.type).toBe('protection');
  });

  test('it has name passed as constructor parameter', () => {
    expect(protection.name).toBe(nameDummy);
  });

  test('it has hitPoints passed as constructor parameter', () => {
    expect(protection.hitPoints).toBe(hitPointsDummy);
  });
});
