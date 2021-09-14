import { Hero } from './hero';
import { HeroType } from './hero-type';
import {
  EquipmentName,
  Protection,
  Weapon,
  WeaponName,
  AnyMonster
} from '../models';
import {
  HeroDouble,
  EquipmentDouble,
  ProtectionDouble,
  WeaponDouble,
  MonsterDouble
} from '../test-doubles';

function mountRandomEquipment(hero: Hero, amount: number): void {
  let protectionAmount = 0;
  let weaponAmount = 0;

  while (amount > 0) {
    if (Math.random() > 0.67) protectionAmount++;
    else weaponAmount++;
    amount--;
  }

  const equipment = [
    ...ProtectionDouble.createDoublesSet(protectionAmount, true), 
    ...WeaponDouble.createDoublesSet(weaponAmount, true)
  ];

  equipment.forEach(piece => {
    hero.mountEquipmentPiece(piece);
  });
}

describe('Hero', () => {
  let type: HeroType;
  let hero: Hero;
  const notReadyMessage = 'Mount 6 equipment pieces before using Hero.';

  beforeEach(() => {
    type = HeroDouble.pickType();
  });

  describe('instantiation and initial state', () => {
    test('it is created', () => {
      hero = new Hero(type, 5);
  
      expect(hero).toBeTruthy();
    });

    test.each([
      'bard', 'mage', 'ninja', 'princess'
    ] as HeroType[])('type equals constructor parameter (%s)', type => {
      hero = new Hero(type, 5);
      
      expect(hero.type).toBe(type);
    });

    test.each([
      0, 1, 2, 3, 4, 5, 6
    ])('initial hitPoints equals constructor parameter (%i)', hitPoints => {
      hero = new Hero(type, hitPoints);
      
      expect(hero.hitPoints).toBe(hitPoints);
    });

    test('it has no mounted equipment', () => {
      hero = new Hero(type, 5);

      expect(hero.getMountedEquipment()).toBeEmpty();
    });

    test('it is not ready to use', () => {
      hero = new Hero(type, 5);
      const equipmentDummy = WeaponDouble.createDouble();
      const enemyDummy = MonsterDouble.createDouble();
      
      expect(() => { hero.discardEquipmentPiece(equipmentDummy.name); })
        .toThrowError(notReadyMessage);
      expect(() => { hero.getWeaponsAgainst(enemyDummy); })
        .toThrowError(notReadyMessage);
      expect(() => { hero.takeDamageFrom(enemyDummy); })
        .toThrowError(notReadyMessage);
      expect(() => { hero.useWeaponAgainst(equipmentDummy.name, enemyDummy); })
        .toThrowError(notReadyMessage);
    });
  });

  describe('equipment mounting and discarding', () => {
    let protectionDummy: Protection;
    let weaponDummy: Weapon;

    beforeEach(() => {
      hero = new Hero(type, 5);
      protectionDummy = ProtectionDouble.createDouble();
      weaponDummy = WeaponDouble.createDouble();
    });

    test(
      'mountEquipment mounts equipment, getMountedEquipment returns it', 
      () => {
        hero.mountEquipmentPiece(protectionDummy);
        hero.mountEquipmentPiece(weaponDummy);

        expect(hero.getMountedEquipment())
          .toIncludeAllMembers([protectionDummy.name, weaponDummy.name]);
      }
    );
    test('mounting of repeated equipment pieces is not allowed', () => {
      hero.mountEquipmentPiece(protectionDummy);

      const duplicate = ProtectionDouble
        .createSpecificDouble(protectionDummy.name);

      expect(() => { hero.mountEquipmentPiece(duplicate); })
        .toThrowError(`Hero has already mounted a piece of ${duplicate.name}.`);
    });

    test.each([
      1, 2, 3, 4, 5
    ])('hero is not ready with %i pieces mounted', piecesAmount => {
      mountRandomEquipment(hero, piecesAmount);
      const enemyDummy = MonsterDouble.createDouble();
      
      expect(() => { hero.discardEquipmentPiece(weaponDummy.name); })
        .toThrowError(notReadyMessage);
      expect(() => { hero.getWeaponsAgainst(enemyDummy); })
        .toThrowError(notReadyMessage);
      expect(() => { hero.takeDamageFrom(enemyDummy); })
        .toThrowError(notReadyMessage);
      expect(() => { hero.useWeaponAgainst(weaponDummy.name, enemyDummy); })
        .toThrowError(notReadyMessage);
    });

    test('hero is ready with 6 pieces mounted', () => {
      mountRandomEquipment(hero, 6);
      const enemyDummy = MonsterDouble.createDouble();
      
      expect(() => { hero.discardEquipmentPiece(weaponDummy.name); })
        .not.toThrowError(notReadyMessage);
      expect(() => { hero.getWeaponsAgainst(enemyDummy); })
        .not.toThrowError(notReadyMessage);
      expect(() => { hero.takeDamageFrom(enemyDummy); })
        .not.toThrowError(notReadyMessage);
      expect(() => { hero.useWeaponAgainst(weaponDummy.name, enemyDummy); })
        .not.toThrowError(notReadyMessage);
    });

    test('equipment mounting is disabled after hero is ready', () => {
      mountRandomEquipment(hero, 6);
      
      expect(() => { hero.mountEquipmentPiece(weaponDummy); })
        .toThrowError('Hero is ready. New equipment mounting not allowed.');
    });

    test('discardEquipmentPiece removes selected equipment', () => {
      mountRandomEquipment(hero, 6);
      const toBeDiscarded = hero.getMountedEquipment()[3];
      hero.discardEquipmentPiece(toBeDiscarded);
      
      expect(hero.getMountedEquipment()).not.toInclude(toBeDiscarded);
    });

    test('equipment mounting keeps disabled after discarding equipment', () => {
      mountRandomEquipment(hero, 6);
      const toBeDiscarded = hero.getMountedEquipment()[3];
      hero.discardEquipmentPiece(toBeDiscarded);
      
      expect(() => { hero.mountEquipmentPiece(weaponDummy); })
        .toThrowError('Hero is ready. New equipment mounting not allowed.');
    });
  
    test('discardEquipmentPiece throws error for non held piece', () => {
      mountRandomEquipment(hero, 6);
      const mountedEquipment = hero.getMountedEquipment();
      let nonHeldPiece: EquipmentName;

      do {
        [nonHeldPiece] = EquipmentDouble.pickNames(1);
      } while (mountedEquipment.includes(nonHeldPiece));
      
      expect(() => { hero.discardEquipmentPiece(nonHeldPiece); })
        .toThrowError(`${nonHeldPiece} not included in hero's equipment.`);
    });

    test('mounting Protection piece increases hero hitPoints', () => {
      const previousHitpoints = hero.hitPoints;
      hero.mountEquipmentPiece(protectionDummy);

      expect(hero.hitPoints).toBe(previousHitpoints + protectionDummy.hitPoints);
    });

    test('unmounting Protection piece decreases hero hitPoints', () => {
      mountRandomEquipment(hero, 5);

      while (hero.getMountedEquipment().includes(protectionDummy.name)) {
        protectionDummy = ProtectionDouble.createDouble();
      }
      
      hero.mountEquipmentPiece(protectionDummy);
      const previousHitpoints = hero.hitPoints;
      hero.discardEquipmentPiece(protectionDummy.name);

      expect(hero.hitPoints).toBe(previousHitpoints - protectionDummy.hitPoints);
    });
  });

  describe('facing monsters', () => {
    let enemyDummy: AnyMonster;
    let weaponDoubles: Weapon[];

    beforeEach(() => {
      enemyDummy = MonsterDouble.createDouble();
      weaponDoubles = WeaponDouble.createDoublesSet(6, true);
      
      hero = new Hero(type, 5);

      for (const weapon of weaponDoubles) {
        hero.mountEquipmentPiece(weapon);
      }
    });

    test('getWeaponsAgainst returns useful weapons against enemy', () => {
      const middleIndex = Math.ceil(weaponDoubles.length / 2);
      const usefulWeaponStubs = weaponDoubles.splice(0, middleIndex);
      const uselessWeaponStubs = weaponDoubles;

      for (const weapon of usefulWeaponStubs) {
        jest.spyOn(weapon, 'isUsefulAgainst').mockReturnValue(true);
      }

      for (const weapon of uselessWeaponStubs) {
        jest.spyOn(weapon, 'isUsefulAgainst').mockReturnValue(false);
      }

      const expectedWeapons = usefulWeaponStubs.map(weapon => weapon.name);

      expect(hero.getWeaponsAgainst(enemyDummy))
        .toIncludeSameMembers(expectedWeapons);
    });

    test('useWeaponAgainst throws error for non held weapon', () => {
      const mountedEquipment = hero.getMountedEquipment();
      let nonHeldWeapon: WeaponName;

      do {
        [nonHeldWeapon] = WeaponDouble.pickNames(1);
      } while (mountedEquipment.includes(nonHeldWeapon));
      
      
      expect(() => { hero.useWeaponAgainst(nonHeldWeapon, enemyDummy); })
        .toThrowError(`${nonHeldWeapon} not included in hero's equipment.`);
    });

    test('useWeaponAgainst calls weapon.useAgainst enemy', () => {
      const weaponMock = weaponDoubles[3];
      jest.spyOn(weaponMock, 'isUsefulAgainst').mockReturnValue(true);
      // override to avoid errors from method execution
      jest.spyOn(weaponMock, 'useAgainst').mockImplementation(jest.fn());
      
      hero.useWeaponAgainst(weaponMock.name, enemyDummy);

      expect(weaponMock.useAgainst).toHaveBeenCalledWith(enemyDummy)
    });

    test.each([-5, -2, 0, 4, 6])(
      'useWeaponAgainst returns hitPoints changed as required by weapon.use', 
      hitPointsChange => {
        const weaponStub = weaponDoubles[3];
        jest.spyOn(weaponStub, 'useAgainst').mockReturnValue(hitPointsChange);
        const previousHitpoints = hero.hitPoints;

        const outcome = hero.useWeaponAgainst(weaponStub.name, enemyDummy);

        expect(outcome.hitPoints.total).toBe(hero.hitPoints);
        expect(outcome.hitPoints.total)
          .toBe(previousHitpoints + hitPointsChange);
        expect(outcome.hitPoints.change).toBe(hitPointsChange);
      }
    );

    test.each([0, 1, 2, 3, 4])(
      'useWeaponAgainst discards weapon and notifies if availableUses = 0', 
      availableUses => {
        const weaponStub = weaponDoubles[3];
        Object.defineProperty(weaponStub, 'availableUses', {
          get: jest.fn(() => availableUses),
        });
        
        /* THIS SHOULD WORK BUT DOESN'T
        jest.spyOn(weaponStub, 'availableUses', 'get')
          .mockReturnValue(availableUses); */

        jest.spyOn(weaponStub, 'isUsefulAgainst').mockReturnValue(true);
        // override to avoid errors from method execution
        jest.spyOn(weaponStub, 'useAgainst').mockImplementation(jest.fn());

        const outcome = hero.useWeaponAgainst(weaponStub.name, enemyDummy);

        if (availableUses > 0) {
          expect(hero.getMountedEquipment()).toInclude(weaponStub.name);
          expect(outcome.discardedWeapon).toBeUndefined();
        } else {
          expect(hero.getMountedEquipment()).not.toInclude(weaponStub.name);
          expect(outcome.discardedWeapon).toBe(weaponStub.name);
        }
      }
    );

    test('useWeaponAgainst returns EncounterOutcome object', () => {
      const weaponStub = weaponDoubles[3];
      jest.spyOn(weaponStub, 'isUsefulAgainst').mockReturnValue(true);
      // override to avoid errors from method execution
      jest.spyOn(weaponStub, 'useAgainst').mockImplementation(jest.fn());

      const outcome = hero.useWeaponAgainst(weaponStub.name, enemyDummy);

      expect(outcome).toContainAllKeys(['hitPoints', 'discardedWeapon']);
      expect(outcome.hitPoints).toContainAllKeys(['total', 'change']);
    });

    test.each([[5, 2], [4, 4], [2, 5]])(
      'takeDamageFrom applies and notifies monster damage', 
      (hitPoints, damage) => {
        hero = new Hero(type, hitPoints);

        for (const weapon of weaponDoubles) {
          hero.mountEquipmentPiece(weapon);
        }

        Object.defineProperty(enemyDummy, 'damage', { value: damage });
        
        const expectedHitPoints = Math.max(0, hitPoints - damage);
        const outcome = hero.takeDamageFrom(enemyDummy);

        expect(outcome.hitPoints.total).toBe(hero.hitPoints);
        expect(outcome.hitPoints.total).toBe(expectedHitPoints);
        expect(outcome.hitPoints.change).toBe(-damage);
        expect(outcome).toContainAllKeys(['hitPoints']);
      }
    );
  });
});
