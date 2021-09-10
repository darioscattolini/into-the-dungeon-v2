import { TestBed } from '@angular/core/testing';
import { randomInteger } from '@into-the-dungeon/util-testing';

import { EquipmentService } from './equipment.service';
import {
  EquipmentName,
  equipmentNames,
  EquipmentDataMapIT,
  EquipmentDataMap,
  EquipmentViewDataMap,
  EquipmentViewDataMapIT,
  equipmentViewDataMap,
  Protection,
  ProtectionName,
  protectionNames,
  Weapon,
  WeaponName,
  weaponNames,
  monsterTypes
} from '../../models/models';
import {
  buildWeaponEffects,
  monsterDummyBuilder,
  pickRandomMonsterTypes
} from '../../models/test-doubles';

/* 
  Some weapons produce complex effects that would require special testing. In
  order to avoid coupling EquipmentService tests with particular weapons, it is
  better to use fake weapons with easily testable effects. Weapons should be 
  tested separately.
 */
type Mutable<T> = { -readonly [P in keyof T]: T[P]; };

function buildFakeEquipmentData(): EquipmentDataMap {
  const weaponNamesList: EquipmentName[] = [...weaponNames];

  const equipmentData: EquipmentDataMap = equipmentNames.reduce((data, name) => {
    if (weaponNamesList.includes(name)) {
      const weaponName = name as WeaponName;
      data[weaponName] = {
        classToBeUsed: Weapon,
        availableUses: 1 + randomInteger(4),
        effects: buildWeaponEffects(pickRandomMonsterTypes(randomInteger(6)))
      }
    } else {
      const protectionName = name as ProtectionName;
      data[protectionName] = {
        classToBeUsed: Protection,
        hitPoints: randomInteger(6)
      }
    }

    return data;
  }, {} as Mutable<EquipmentDataMap>);

  return equipmentData;
}

describe('EquipmentService', () => {
  let equipmentService: EquipmentService;
  let fakeEquipmentData: EquipmentDataMap;

  beforeAll(() => {
    fakeEquipmentData = buildFakeEquipmentData();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EquipmentService,
        { provide: EquipmentDataMapIT, useValue: fakeEquipmentData },
        { provide: EquipmentViewDataMapIT, useValue: equipmentViewDataMap }
      ]
    });

    equipmentService = TestBed.inject(EquipmentService);
  });

  test('it is created', () => {
    expect(equipmentService).toBeTruthy();
  });

  describe.each(protectionNames)('createPiece: protection - %s', name => {
    let protection: Protection;

    test('it returns a piece of Protection', () => {
      protection = equipmentService.createPiece(name);

      expect(protection).toBeTruthy();
      expect(protection).toBeInstanceOf(Protection);
    });

    test('protection has expected name', () => {
      protection = equipmentService.createPiece(name);

      expect(protection.name).toBe(name);
    });

    test('protection has expected hitPoints from equipmentData', () => {
      protection = equipmentService.createPiece(name);

      expect(protection.hitPoints).toBe(fakeEquipmentData[name].hitPoints);
    });
  });

  describe.each(weaponNames)('createPiece: weapon - %s', name => {
    let weapon: Weapon;

    test('it returns a Weapon', () => {
      weapon = equipmentService.createPiece(name);

      expect(weapon).toBeTruthy();
      expect(weapon).toBeInstanceOf(Weapon);
    });

    test('weapon has expected name', () => {
      weapon = equipmentService.createPiece(name);

      expect(weapon.name).toBe(name);
    });

    test('weapon has expected availableUses from equipmentData', () => {
      weapon = equipmentService.createPiece(name);

      expect(weapon.availableUses).toBe(fakeEquipmentData[name].availableUses);
    });

    test.each(
      monsterTypes
    )('weapon has expected effect from equipmData against %s', monsterType => {
      weapon = equipmentService.createPiece(name);
      const monsterDummy = monsterDummyBuilder[monsterType];
      const expectedEffect = fakeEquipmentData[name].effects[monsterType];

      if (expectedEffect) {
        expect(weapon.isUsefulAgainst(monsterDummy)).toBeTrue();
        expect(weapon.useAgainst(monsterDummy))
          .toBe(expectedEffect(monsterDummy.damage));
      } else {
        expect(weapon.isUsefulAgainst(monsterDummy)).toBeFalse();
      }
    });
  });

  describe.each(protectionNames)('getViewDataFor: protection - %s)', name => {
    let viewData: EquipmentViewDataMap[typeof name];

    beforeEach(() => {
      viewData = equipmentService.getViewDataFor(name);
    });

    test('it returns an object of ProtectionViewData type', () => {
      expect(viewData).toContainAllKeys([
        'name', 'type', 'description', 'image', 'hitPoints', 
      ]);
      expect(viewData.name).toBeString();
      expect(viewData.type).toBeString();
      expect(viewData.description).toBeString();
      expect(viewData.image).toBeString();
      expect(viewData.hitPoints).toBeNumber();
    });

    test('its name is the same as in equipmentViewDataMap', () => {
      expect(viewData.name).toBe(equipmentViewDataMap[name].name);
    });

    test('its type is the same as in equipmentViewDataMap', () => {
      expect(viewData.type).toBe(equipmentViewDataMap[name].type);
    });

    test('its desciption is the same as in equipmentViewDataMap', () => {
      expect(viewData.description).toBe(equipmentViewDataMap[name].description);
    });

    test('its image Path is the same as in equipmentViewDataMap', () => {
      expect(viewData.image).toBe(equipmentViewDataMap[name].image);
    });

    test('its hitPoints are the same as in equipmentViewDataMap', () => {
      expect(viewData.hitPoints).toBe(equipmentViewDataMap[name].hitPoints);
    });
  });

  describe.each(weaponNames)('getViewDataFor: weapon - %s)', name => {
    let viewData: EquipmentViewDataMap[typeof name];

    beforeEach(() => {
      viewData = equipmentService.getViewDataFor(name);
    });

    test('it returns an object of WeaponViewData type', () => {
      expect(viewData).toContainAllKeys([
        'name', 
        'type', 
        'description', 
        'image', 
        'availableUses', 
        'effectiveAgainst'
      ]);
      expect(viewData.name).toBeString();
      expect(viewData.type).toBeString();
      expect(viewData.description).toBeString();
      expect(viewData.image).toBeString();
      expect(viewData.availableUses).toBeNumber();
      expect(viewData.effectiveAgainst).toBeArray();
    });

    test('its name is the same as in equipmentViewDataMap', () => {
      expect(viewData.name).toBe(equipmentViewDataMap[name].name);
    });

    test('its type is the same as in equipmentViewDataMap', () => {
      expect(viewData.type).toBe(equipmentViewDataMap[name].type);
    });

    test('its desciption is the same as in equipmentViewDataMap', () => {
      expect(viewData.description).toBe(equipmentViewDataMap[name].description);
    });

    test('its image Path is the same as in equipmentViewDataMap', () => {
      expect(viewData.image).toBe(equipmentViewDataMap[name].image);
    });

    test('its availableUses are the same as in equipmentViewDataMap', () => {
      expect(viewData.availableUses)
        .toBe(equipmentViewDataMap[name].availableUses);
    });

    test('its targets are the same as in equipmentViewDataMap', () => {
      const expectedTargets 
        = Array.from(equipmentViewDataMap[name].effectiveAgainst);

      expect(viewData.effectiveAgainst).toIncludeSameMembers(expectedTargets);
    });
  });
});
