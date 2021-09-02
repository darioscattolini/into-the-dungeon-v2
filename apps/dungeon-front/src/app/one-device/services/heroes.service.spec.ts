import { TestBed } from '@angular/core/testing';

import { HeroesService } from './heroes.service';
import { EquipmentService } from './equipment.service';
import { 
  Hero, heroTypes, HeroDataMapIT, heroDataMap, 
  AnyHeroViewData, HeroViewDataMapIT, heroViewDataMap,
  Equipment, EquipmentName, AnyEquipmentViewData, equipmentViewDataMap,
  Weapon, WeaponName, weaponNames, Protection, ProtectionName
} from '../../models/models';
import { MonsterDouble, pickRandomWeaponNames } from '../../models/test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

jest.mock('./equipment.service');

describe('HeroesService', () => {
  let heroesService: HeroesService;
  let equipmentServiceMock: EquipmentService;
  let requiredEquipmentPieces: EquipmentName[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroesService,
        EquipmentService,
        { provide: HeroDataMapIT, useValue: heroDataMap },
        { provide: HeroViewDataMapIT, useValue: heroViewDataMap }
      ]
    });

    heroesService = TestBed.inject(HeroesService);
    equipmentServiceMock = TestBed.inject(EquipmentService);
    requiredEquipmentPieces = heroTypes.reduce((pieces, type) => {
      pieces.push(...heroDataMap[type].equipment)
      return pieces;
    }, [] as EquipmentName[]);
  });

  test('it is created', () => {
    expect(heroesService).toBeTruthy();
  });

  describe('getHeroOptions', () => {
    let options: AnyHeroViewData[];
    let getViewMock: jest
      .SpyInstance<AnyEquipmentViewData, [equipmentName: EquipmentName]>;

    beforeEach(() => {
      getViewMock = jest.spyOn(equipmentServiceMock, 'getViewDataFor')
        .mockImplementation(
          (piece: EquipmentName) => equipmentViewDataMap[piece]
        );
    });

    test('it returns as many options as heroTypes', () => {
      options = heroesService.getHeroOptions();

      expect(options.length).toBe(heroTypes.length);
    });

    test('every option is of HeroViewData type', () => {
      options = heroesService.getHeroOptions();

      options.forEach(option => {
        expect(option).toContainAllKeys([
          'type', 'description', 'image', 'baseHitPoints', 'equipment'
        ]);
        expect(option.type).toBeString();
        expect(option.description).toBeString();
        expect(option.image).toBeString();
        expect(option.baseHitPoints).toBeNumber();
        expect(option.equipment).toBeArray();
      });
    });

    test('every option type corresponds to one of heroTypes', () => {
      options = heroesService.getHeroOptions();
      const optionTypes = options.map(option => option.type);
      
      expect(optionTypes).toIncludeSameMembers(Array.from(heroTypes));
    });

    test('descriptions in options are the same as in heroViewDataMap', () => {
      options = heroesService.getHeroOptions();

      options.forEach(option => {
        expect(option.description)
          .toBe(heroViewDataMap[option.type].description);
      });
    });

    test('image paths in options are the same as in heroViewDataMap', () => {
      options = heroesService.getHeroOptions();

      options.forEach(option => {
        expect(option.image)
          .toBe(heroViewDataMap[option.type].image);
      });
    });

    test(
      'it asks equipmentService for views of pieces required by heroData', 
      () => {
        heroesService.getHeroOptions();
        const requestedPieces = getViewMock.mock.calls.map(args => args[0]);

        expect(requestedPieces).toIncludeSameMembers(requiredEquipmentPieces);
      }
    );

    test('equipment in options are pieces required by heroData', () => {
      options = heroesService.getHeroOptions();
      
      options.forEach(option => {
        const expectedNames = Array.from(heroDataMap[option.type].equipment);
        const returnedNames = option.equipment.map(piece => piece.name);
        
        expect(returnedNames).toIncludeSameMembers(expectedNames);
      });
    });

    test(
      'equipmentViewData in options are the ones returned by equipmentService', 
      () => {             
        options = heroesService.getHeroOptions();

        options.forEach(option => {
          option.equipment.forEach(returnedViewData => {
            const expectedViewData = equipmentServiceMock
              .getViewDataFor(returnedViewData.name);
            
              expect(returnedViewData).toEqual(expectedViewData);
          });
        });
      }
    );
  });

  describe.each(heroTypes)('createHero: %s', type => {
    let hero: Hero;
    let createPieceMock: jest
      .SpyInstance<Equipment, [equipmentName: EquipmentName]>;

    beforeEach(() => {
      type EquipmentProvider = {
        [key in EquipmentName]: Equipment
      };

      const equipmentProvider: EquipmentProvider 
        = requiredEquipmentPieces.reduce((provider, pieceName) => {
          let piece: Equipment;
          
          // a bit of type manipulation because of Array.includes() 
          // narrow constraints on parameter
          const weaponNamesList: EquipmentName[] = [...weaponNames];

          if (weaponNamesList.includes(pieceName)) {
            piece = new Weapon(pieceName as WeaponName, randomInteger(5), {});
          } else {
            piece = new Protection(pieceName as ProtectionName, randomInteger(5));
          }

          provider[pieceName] = piece;

          return provider;
        }, {} as EquipmentProvider);

        createPieceMock = jest.spyOn(equipmentServiceMock, 'createPiece')
          .mockImplementation(
            (piece: EquipmentName) => equipmentProvider[piece]
          );
    });

    test('it returns a Hero', () => {
      hero = heroesService.createHero(type);

      expect(hero).toBeTruthy();
      expect(hero).toBeInstanceOf(Hero);
    });

    test('hero is of expected type', () => {
      hero = heroesService.createHero(type);

      expect(hero.type).toBe(type);
    });

    test('hero has expected base hitPoints from heroData', () => {
      hero = heroesService.createHero(type);

      // unmount all equipment to reduce hitPoints to base
      for (const piece of heroDataMap[type].equipment) {
        hero.discardEquipmentPiece(piece);
      }

      expect(hero.hitPoints).toBe(heroDataMap[type].hitPoints);
    });

    test('hero has all expected equipment from heroData', () => {
      const expectedEquipment = Array.from(heroDataMap[type].equipment);
      hero = heroesService.createHero(type);

      expect(hero.getMountedEquipment()).toIncludeSameMembers(expectedEquipment);
    });

    test('hero requested all expected equipment to equipmentService', () => {
      const expectedEquipment = Array.from(heroDataMap[type].equipment);
      hero = heroesService.createHero(type);
      const requestedPieces = createPieceMock.mock.calls.map(args => args[0]);

      expect(requestedPieces).toIncludeSameMembers(expectedEquipment);
    });

    test('hero is ready to play', () => {
      hero = heroesService.createHero(type);
      const [weaponDummy] = pickRandomWeaponNames(1);
      const enemyDummy = MonsterDouble.createDouble();
      const notReadyMessage = 'Mount 6 equipment pieces before using Hero.';
      
      expect(() => { hero.discardEquipmentPiece(weaponDummy); })
        .not.toThrowError(notReadyMessage);
      expect(() => { hero.getWeaponsAgainst(enemyDummy); })
        .not.toThrowError(notReadyMessage);
      expect(() => { hero.takeDamageFrom(enemyDummy); })
        .not.toThrowError(notReadyMessage);
      expect(() => { hero.useWeaponAgainst(weaponDummy, enemyDummy); })
        .not.toThrowError(notReadyMessage);
    });
  });
});
