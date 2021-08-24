import { Protection } from './protection';
import { ProtectionName } from './equipment-name';
import { Equipment } from './equipment';
import { pickRandomProtectionNames } from '../test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

describe('Protection', () => {
  let protection: Protection;
  let name: ProtectionName;
  let hitPoints: number;

  beforeEach(() => {
    [name] = pickRandomProtectionNames(1);
    hitPoints = randomInteger(7);
    protection = new Protection(name, hitPoints);
  });

  test('it is created', () => {
    expect(protection).toBeTruthy();
  });

  test('it is instance of Equipment', () => {
    expect(protection).toBeInstanceOf(Equipment);
  });

  test('it has name passed as constructor parameter', () => {
    expect(protection.name).toBe(name);
  });

  test('it has hitPoints passed as constructor parameter', () => {
    expect(protection.hitPoints).toBe(hitPoints);
  });
});
