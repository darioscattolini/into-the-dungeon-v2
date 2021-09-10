import { Weapon } from './weapon';
import { WeaponName } from '../equipment-name';
import { WeaponEffects } from './weapon-effects';
import { MonsterType, monsterTypes } from '../../models';
import {
  pickRandomWeaponNames,
  buildWeaponEffects,
  pickRandomMonsterTypes,
  monsterDummyBuilder
} from '../../test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

describe('Weapon', () => {
  let weapon: Weapon;
  let nameDummy: WeaponName;
  let availableUsesDummy: number;
  let effectsDummy: WeaponEffects;
  let targetedMonsters: MonsterType[];

  beforeEach(() => {
    [nameDummy] = pickRandomWeaponNames(1);
    availableUsesDummy = 1 + randomInteger(3);
    effectsDummy = {};
    targetedMonsters = pickRandomMonsterTypes(4);
    weapon = new Weapon(nameDummy, availableUsesDummy, effectsDummy);
  });

  test('it is created', () => {
    expect(weapon).toBeTruthy();
  });

  test('it is of type Weapon', () => {
    expect(weapon.type).toBe('weapon');
  });

  test('it has name passed as constructor parameter', () => {
    expect(weapon.name).toBe(nameDummy);
  });

  test('it has availableUses passed as constructor parameter', () => {
    expect(weapon.availableUses).toBe(availableUsesDummy);
  });

  test('it is useless if availableUses is 0', () => {
    weapon = new Weapon(nameDummy, 0, {});
    const monsterDummy = monsterDummyBuilder.orc;

    expect(() => { weapon.isUsefulAgainst(monsterDummy); })
      .toThrowError(
        'availableUses is 0. Weapon should have been discarded after last use.'
      );
    
    expect(() => { weapon.useAgainst(monsterDummy); })
      .toThrowError(
        'availableUses is 0. Weapon should have been discarded after last use.'
      );
  });

  test.each(
    monsterTypes
  )('it is useless against %s if effects parameter empty', monsterType => {
    weapon = new Weapon(nameDummy, availableUsesDummy, {});
    const monsterDummy = monsterDummyBuilder[monsterType];
    
    expect(weapon.isUsefulAgainst(monsterDummy)).toBeFalse();
    expect(() => { weapon.useAgainst(monsterDummy); })
      .toThrowError(`${weapon.name} cannot be used against ${monsterType}.`);
  });

  test.each(
    monsterTypes
  )('it is useful against %s if monster included in effects', monsterType => {
    const effects = buildWeaponEffects(targetedMonsters);
    weapon = new Weapon(nameDummy, availableUsesDummy, effects);
    const monsterDummy = monsterDummyBuilder[monsterType];
    
    expect(weapon.isUsefulAgainst(monsterDummy))
      .toBe(targetedMonsters.includes(monsterType));

    if (targetedMonsters.includes(monsterType)) {
      expect(() => { weapon.useAgainst(monsterDummy); }).not.toThrowError();  
    } else {
      expect(() => { weapon.useAgainst(monsterDummy); })
        .toThrowError(`${weapon.name} cannot be used against ${monsterType}.`);
    }
  });

  test.each(
    monsterTypes
  )('use against %s returns expected effect', monsterType => {
    const effects = buildWeaponEffects(targetedMonsters);
    weapon = new Weapon(nameDummy, availableUsesDummy, effects);
    const monsterDummy = monsterDummyBuilder[monsterType];
    const effectCalculator = effects[monsterType];

    if (effectCalculator) {
      const expectedEffect = effectCalculator(monsterDummy.damage);

      expect(weapon.useAgainst(monsterDummy)).toBe(expectedEffect);
    } else {
      expect(() => { weapon.useAgainst(monsterDummy); })
        .toThrowError(`${weapon.name} cannot be used against ${monsterType}.`);
    }
  });

  test('useWeapon decreases available uses by 1', () => {
    const effect: WeaponEffects = { orc: () => 2 };
    const weapon = new Weapon(nameDummy, availableUsesDummy, effect);
    const monsterDummy = monsterDummyBuilder.orc;
    const previousAvailableUses = weapon.availableUses;
    
    weapon.useAgainst(monsterDummy);

    expect(weapon.availableUses).toBe(previousAvailableUses - 1);
  });
});
