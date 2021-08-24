import { Raid } from './raid';
import { Hero, AnyMonster, ChosenWeapon } from '../../models';
import { 
  HeroDouble, MonsterDouble, pickRandomEquipmentNames, pickRandomWeaponNames 
} from '../../test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

function playPreviousRounds(raid: Raid, round: number) {
  for (let i = 1; i < round; i++) {
    raid.getCurrentEncounter();
    raid.resolveCurrentEncounter('NO_WEAPON');
  }
}

describe('Raid', () => {
  let raid: Raid;
  let heroMock: Hero;
  let enemiesDummy: AnyMonster[];

  beforeEach(() => {
    heroMock = HeroDouble.createDouble();
    enemiesDummy = [
      MonsterDouble.createDouble(), 
      MonsterDouble.createDouble(),
      MonsterDouble.createDouble()
    ];
  });

  describe('instantiation and initial state', () => {
    test('it is created', () => {
      raid = new Raid(heroMock, enemiesDummy);

      expect(raid).toBeTruthy();
    });

    test.each([
      0, 1, 2, 3
    ])('heroHitPoints equals hero\'s hitPoints (%i)', hitPoints => {
      Object.defineProperty(heroMock, 'hitPoints', {
        get: jest.fn(() => hitPoints)
      });
      
      /* THIS SHOULD WORK BUT DOESN'T
      jest.spyOn(heroMock, 'hitPoints', 'get').mockReturnValue(hitPoints); */
      
      raid = new Raid(heroMock, enemiesDummy);

      expect(raid.heroHitPoints).toBe(hitPoints);
    });

    test.each([
      [pickRandomEquipmentNames(3)], 
      [pickRandomEquipmentNames(4)], 
      [pickRandomEquipmentNames(4)], 
      [pickRandomEquipmentNames(3)]
    ])('heroEquipment equals hero\'s getMountedEquipment', equipment => {
      jest.spyOn(heroMock, 'getMountedEquipment')
        .mockReturnValue(equipment);
      
      raid = new Raid(heroMock, enemiesDummy);

      expect(raid.heroEquipment).toEqual(equipment);
    });

    test.each([
      0, 1, 2, 3
    ])('enemiesLeft equals enemies parameter length (%i)', enemiesLeft => {
      enemiesDummy = [];
      
      for (let i = 0; i < enemiesLeft; i++) {
        enemiesDummy.push(MonsterDouble.createDouble());
      }
      
      raid = new Raid(heroMock, enemiesDummy);

      expect(raid.enemiesLeft).toBe(enemiesLeft);
    });

    test('resolveCurrentEncounter cannot be called', () => {
      raid = new Raid(heroMock, enemiesDummy);
      const [weaponDummy] = pickRandomWeaponNames(1);

      expect(() => { raid.resolveCurrentEncounter(weaponDummy); })
        .toThrowError(
          'No enemy picked. Method should be called after getCurrentEncounter.'
        );
    });
  });

  describe('goesOn', () => {
    test.each([
      [1, 1], [1, 2], [1, 3],
      [2, 1], [2, 2], [2, 3],
      [3, 1], [3, 2], [3, 3],
    ])(
      'raid goes on if heroHitPoints (%i) > 0 and enemiesLeft (%i) > 0',
      (hitPoints, enemiesLeft) => {
        Object.defineProperty(heroMock, 'hitPoints', {
          get: jest.fn(() => hitPoints)
        });
        
        /* THIS SHOULD WORK BUT DOESN'T
        jest.spyOn(heroMock, 'hitPoints', 'get').mockReturnValue(hitPoints); */

        enemiesDummy = [];
      
        for (let i = 0; i < enemiesLeft; i++) {
          enemiesDummy.push(MonsterDouble.createDouble());
        }
        
        raid = new Raid(heroMock, enemiesDummy);

        expect(raid.enemiesLeft).toBe(enemiesLeft); // testing setup
        expect(raid.goesOn()).toBeTrue();
      }
    );

    test.each([
      [0, 1], [0, 2], [0, 3], [0, 4]
    ])('raid stops if heroHitPoints are 0', (hitPoints, enemiesLeft) => {
      Object.defineProperty(heroMock, 'hitPoints', {
        get: jest.fn(() => hitPoints)
      });
      
      /* THIS SHOULD WORK BUT DOESN'T
      jest.spyOn(heroMock, 'hitPoints', 'get').mockReturnValue(hitPoints); */

      enemiesDummy = [];
    
      for (let i = 0; i < enemiesLeft; i++) {
        enemiesDummy.push(MonsterDouble.createDouble());
      }
      
      raid = new Raid(heroMock, enemiesDummy);

      expect(raid.enemiesLeft).toBe(enemiesLeft); // testing setup
      expect(raid.goesOn()).toBeFalse();
    });

    test.each([1, 2, 3, 4])('raid stops if enemiesLeft are 0', hitPoints => {
      Object.defineProperty(heroMock, 'hitPoints', {
        get: jest.fn(() => hitPoints)
      });
      
      /* THIS SHOULD WORK BUT DOESN'T
      jest.spyOn(heroMock, 'hitPoints', 'get').mockReturnValue(hitPoints); */

      enemiesDummy = [];
    
      raid = new Raid(heroMock, enemiesDummy);

      expect(raid.enemiesLeft).toBe(0); // testing setup
      expect(raid.goesOn()).toBeFalse();
    });
  });

  describe('getCurrentEncounter', () => {
    const maxRounds = 6;

    beforeEach(() => {
      enemiesDummy = [];
      
      for (let i = 0; i < maxRounds; i++) {
        enemiesDummy.push(MonsterDouble.createDouble());
      }

      raid = new Raid(heroMock, enemiesDummy);

      // overrides to avoid coupling tests to Hero methods constraints
      jest.spyOn(heroMock, 'getWeaponsAgainst').mockImplementation(() => []);
      jest.spyOn(heroMock, 'takeDamageFrom').mockImplementation(jest.fn());
    });

    test('it throws error if there are no enemies left', () => {
      enemiesDummy = [];

      raid = new Raid(heroMock, enemiesDummy);

      expect(() => { raid.getCurrentEncounter(); })
        .toThrowError('No enemies left. Raid should have ended.');
    });

    test.each([1, 2, 3, 4, 5, 6])('it does not change public state', round => {
      playPreviousRounds(raid, round);

      const previousHitPoints = raid.heroHitPoints;
      const previousEquipment = raid.heroEquipment;
      const previousEnemiesLeft = raid.enemiesLeft;

      raid.getCurrentEncounter();

      expect(raid.heroHitPoints).toBe(previousHitPoints);
      expect(raid.heroEquipment).toIncludeSameMembers(previousEquipment);
      expect(raid.enemiesLeft).toBe(previousEnemiesLeft);
    });

    test.each([1, 2, 3, 4, 5, 6])('it returns Encounter object', round => {
      playPreviousRounds(raid, round);

      const encounter = raid.getCurrentEncounter();

      expect(encounter).toContainAllKeys(['enemy', 'weapons']);
      expect(encounter.enemy).toBeString();
      expect(encounter.weapons).toBeArray();
    });

    test.each([1, 2, 3, 4, 5, 6])('it returns enemy %i', round => {
      playPreviousRounds(raid, round);

      const expectedEnemy = enemiesDummy[round - 1].type;
      const encounter = raid.getCurrentEncounter();

      expect(encounter.enemy).toBe(expectedEnemy);
    });

    test.each([
      1, 2, 3, 4, 5, 6
    ])('it returns weapons from hero.getWeaponsAgains', round => {
      playPreviousRounds(raid, round);

      const expectedWeapons = pickRandomWeaponNames(3);

      jest.spyOn(heroMock, 'getWeaponsAgainst')
        .mockImplementation(() => expectedWeapons);

      const encounter = raid.getCurrentEncounter();

      expect(heroMock.getWeaponsAgainst)
        .toHaveBeenLastCalledWith(enemiesDummy[round - 1]);
      expect(encounter.weapons).toIncludeSameMembers(expectedWeapons);
    });
  });

  describe.each([true, false])('resolveCurrentEncounter', useWeapon => {
    let chosenWeapon: ChosenWeapon;
    
    beforeEach(() => {
      // overrides to avoid coupling tests to Hero methods constraints
      jest.spyOn(heroMock, 'getWeaponsAgainst').mockImplementation(() => []);
      jest.spyOn(heroMock, 'takeDamageFrom').mockImplementation(jest.fn());
      jest.spyOn(heroMock, 'useWeaponAgainst').mockImplementation(jest.fn());

      raid = new Raid(heroMock, enemiesDummy);
      chosenWeapon = useWeapon ? pickRandomWeaponNames(1)[0] : 'NO_WEAPON';
    });

    test('it cannot be called right after itself', () => {
      raid.getCurrentEncounter();
      raid.resolveCurrentEncounter(chosenWeapon);

      expect(() => { raid.resolveCurrentEncounter(chosenWeapon); })
        .toThrowError(
          'No enemy picked. Method should be called after getCurrentEncounter.'
        );
    });

    test('it cannot be called again after next encounter request', () => {
      raid.getCurrentEncounter();
      raid.resolveCurrentEncounter(chosenWeapon);
      raid.getCurrentEncounter();

      expect(() => { raid.resolveCurrentEncounter(chosenWeapon); })
        .not.toThrowError();
    });

    test('enemiesLeft decrease by one', () => {
      raid.getCurrentEncounter();

      const previousEnemiesLeft = raid.enemiesLeft;
      
      raid.resolveCurrentEncounter(chosenWeapon);

      expect(raid.enemiesLeft).toBe(previousEnemiesLeft - 1);
    });

    test.each([
      1, 2, 3
    ])('appropriate Hero method is called with weapon against enemy', round => {
      playPreviousRounds(raid, round);
      
      raid.getCurrentEncounter();
      raid.resolveCurrentEncounter(chosenWeapon);

      if (useWeapon) {
        expect(heroMock.useWeaponAgainst)
          .toHaveBeenLastCalledWith(chosenWeapon, enemiesDummy[round-1]);
      } else {
        expect(heroMock.takeDamageFrom)
          .toHaveBeenLastCalledWith(enemiesDummy[round-1]);
      }
    });

    test('it returns EncounterOutcome from appropriate Hero method', () => {
      const outcomeDummy = { hitPointsChange: randomInteger(10) };
      jest.spyOn(heroMock, 'useWeaponAgainst').mockReturnValue(outcomeDummy);
      jest.spyOn(heroMock, 'takeDamageFrom').mockReturnValue(outcomeDummy);

      raid.getCurrentEncounter();
      const outcome = raid.resolveCurrentEncounter(chosenWeapon);

      expect(outcome).toEqual(outcomeDummy);
    });
  });
});
