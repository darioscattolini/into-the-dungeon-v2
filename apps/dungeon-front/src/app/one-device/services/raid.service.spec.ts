import { TestBed } from '@angular/core/testing';
import { mocked } from 'ts-jest/utils';
import { randomInteger } from '@into-the-dungeon/util-testing';

import { RaidService } from './raid.service';
import { UiMediatorService } from './ui-mediator.service';
import {
  AnyMonster,
  Encounter,
  Hero,
  MonsterType,
  Player,
  Raid,
  RaidParticipants,
  RaidState,
  WeaponName
} from '../../models/models';
import {
  HeroDouble,
  MonsterDouble,
  PlayerDouble,
  WeaponDouble
} from '../../models/test-doubles';

jest.mock('./ui-mediator.service');

jest.mock('../../models/game-mechanics/raid/raid')
const RaidMock = mocked(Raid);

function makeLoopRunTimes(times: number): void {
  let loopController = jest.spyOn(Raid.prototype, 'goesOn')
    .mockReturnValue(false);

  for (let i = 0; i < times; i++) {
    loopController = loopController.mockReturnValueOnce(true);
  }
}

describe('RaidService', () => {
  let raidService: RaidService;
  let uiMediator: UiMediatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RaidService,
        UiMediatorService
      ]
    });

    raidService = TestBed.inject(RaidService);
    uiMediator = TestBed.inject(UiMediatorService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    RaidMock.mockRestore();
  });

  it('should be created', () => {
    expect(raidService).toBeTruthy();
  });

  describe('playRaid', () => {
    let participantsDummy: RaidParticipants;
    let raiderDummy: Player;
    let heroDummy: Hero;
    let enemiesDummy: AnyMonster[];

    beforeEach(() => {
      raiderDummy = PlayerDouble.createDouble();
      heroDummy = HeroDouble.createDouble();
      enemiesDummy = [
        MonsterDouble.createDouble(),
        MonsterDouble.createDouble(),
        MonsterDouble.createDouble()
      ];

      participantsDummy = { 
        raider: raiderDummy, 
        hero: heroDummy, 
        enemies: enemiesDummy 
      };
    });

    test('Raid is instantiated with the right parameters', async () => {
      makeLoopRunTimes(0);

      expect.assertions(1);

      await raidService.playRaid(participantsDummy);

      expect(Raid).toHaveBeenCalledWith(heroDummy, enemiesDummy);
    });

    test('Raid is instantiated only once', async () => {
      //stubbed dependency
      jest.spyOn(Raid.prototype, 'getCurrentEncounter')
        .mockReturnValue({ enemy: 'golem', weapons: [] });

      makeLoopRunTimes(3);

      expect.assertions(1);

      await raidService.playRaid(participantsDummy);

      expect(Raid).toHaveBeenCalledTimes(1);
    });

    test('loop runs as many times as raid.goesOn is true', async () => {
      //stubbed dependency
      jest.spyOn(Raid.prototype, 'getCurrentEncounter')
        .mockReturnValue({ enemy: 'golem', weapons: [] });

      const times = randomInteger(5) + 2;
      makeLoopRunTimes(times);

      expect.assertions(1);

      await raidService.playRaid(participantsDummy);

      const [raidMock] = RaidMock.mock.instances;

      expect(raidMock.getCurrentEncounter).toHaveBeenCalledTimes(times);
    });

    describe('loop run with no weapons to choose', () => {
      let enemyDummy: MonsterType;
      const weaponOptionsDummy: WeaponName[] = [];

      beforeEach(() => {
        makeLoopRunTimes(1);

        jest.spyOn(Raid.prototype, 'getCurrentEncounter')
          .mockReturnValue({
            enemy: enemyDummy,
            weapons: weaponOptionsDummy
          });        
      });

      test('it does not request encounter resolution', async () => {
        expect.assertions(1);

        await raidService.playRaid(participantsDummy);
    
        expect(uiMediator.requestEncounterResolution)
          .not.toHaveBeenCalled();
      });

      test(
        'it calls raid.resolveEncounter after raid.getCurrentEncounter', 
        async () => {
          expect.assertions(1);

          await raidService.playRaid(participantsDummy);

          const [raidMock] = RaidMock.mock.instances;
      
          expect(raidMock.resolveCurrentEncounter)
            .toHaveBeenCalledAfter(raidMock.getCurrentEncounter as jest.Mock);
        }
      );

      test('raid.resolveEncounter is called with NO_WEAPON', async () => {
        expect.assertions(1);

        await raidService.playRaid(participantsDummy);
        
        const [raidMock] = RaidMock.mock.instances;
        
        expect(raidMock.resolveCurrentEncounter)
          .toHaveBeenCalledWith('NO_WEAPON');
      });
    });

    describe('loop run with weapons to choose', () => {
      let encounterDummy: Encounter;

      beforeEach(() => {
        encounterDummy = {
          enemy: MonsterDouble.pickTypes(1)[0],
          weapons: WeaponDouble.pickNames(4)
        }
        const chosenWeaponDummy = encounterDummy.weapons[2];

        makeLoopRunTimes(1);

        jest.spyOn(Raid.prototype, 'getCurrentEncounter')
          .mockReturnValue(encounterDummy);
        
        jest.spyOn(uiMediator, 'requestEncounterResolution')
          .mockResolvedValue(chosenWeaponDummy);
      });

      test('it requests resolution after getCurrentEncounter', async () => {
        expect.assertions(1);

        await raidService.playRaid(participantsDummy);

        const [raidMock] = RaidMock.mock.instances;
    
        expect(uiMediator.requestEncounterResolution)
          .toHaveBeenCalledAfter(raidMock.getCurrentEncounter as jest.Mock);
      });

      test('resolution is requested with expected parameters', async () => {
        const stateDummy: RaidState = {
          hero: heroDummy,
          remainingEnemies: 1 + randomInteger(5)
        };

        Object.defineProperty(Raid.prototype, 'state', { value: stateDummy });

        expect.assertions(1);

        await raidService.playRaid(participantsDummy);
      
        expect(uiMediator.requestEncounterResolution)
          .toHaveBeenCalledWith(raiderDummy, encounterDummy, stateDummy);
      });

      test('it throws error if chosen weapon was not in options', async () => {
        const optionsDummy: WeaponName[] = ['smoke bomb', 'katana', 'dark stone'];
        const wrongChoice: WeaponName = 'royal sceptre';
        
        jest.spyOn(Raid.prototype, 'getCurrentEncounter')
          .mockReturnValue({
            enemy: 'orc',
            weapons: optionsDummy
          });

        jest.spyOn(uiMediator, 'requestEncounterResolution')
          .mockResolvedValue(wrongChoice);
          
        expect.assertions(1);
  
        await expect(raidService.playRaid(participantsDummy))
          .rejects
          .toThrow('Chosen weapon not included among eligible options');
      });

      test(
        'it calls raid.resolveEncounter after requesting weapon choice', 
        async () => {
          expect.assertions(1);

          await raidService.playRaid(participantsDummy);

          const [raidMock] = RaidMock.mock.instances;
      
          expect(raidMock.resolveCurrentEncounter)
            .toHaveBeenCalledAfter(
              uiMediator.requestEncounterResolution as jest.Mock
            );
        }
      );

      test(
        'raid.resolveEncounter is called with chosen weapon from uiMediator', 
        async () => {
          const randomIndex = randomInteger(encounterDummy.weapons.length, false);
          const chosenWeapon = encounterDummy.weapons[randomIndex];
          
          jest.spyOn(uiMediator, 'requestEncounterResolution')
            .mockResolvedValue(chosenWeapon);

          expect.assertions(1);

          await raidService.playRaid(participantsDummy);
        
          const [raidMock] = RaidMock.mock.instances;
        
          expect(raidMock.resolveCurrentEncounter)
            .toHaveBeenCalledWith(chosenWeapon);
        }
      );
    });

    describe.each([0, 1, 2, 3, 4])('return value', heroHitPoints => {
      beforeEach(() => {
        Object.defineProperty(Raid.prototype, 'heroHitPoints', {
          get: jest.fn(() => heroHitPoints)
        });
        
        /* THIS SHOULD WORK BUT DOESN'T
        jest.spyOn(Raid.prototype, 'heroHitPoints', 'get')
          .mockReturnValue(heroHitPoints); */
      });

      test('it is an instance of RaidResult', async () => {
        expect.assertions(3);
  
        const raidResult = await raidService.playRaid(participantsDummy);
  
        expect(raidResult).toContainAllKeys(['raider', 'survived']);
        expect(raidResult.raider).toBeInstanceOf(Player);
        expect(raidResult.survived).toBeBoolean();
      });

      test('it returns participant raider', async () => {
        expect.assertions(1);
  
        const raidResult = await raidService.playRaid(participantsDummy);

        expect(raidResult.raider).toBe(raiderDummy);
      });

      test('it returns survived value depending on heroHitPoints', async () => {
        expect.assertions(1);
        
        const survivedExpectation = heroHitPoints > 0;
        const raidResult = await raidService.playRaid(participantsDummy);

        expect(raidResult.survived).toBe(survivedExpectation);
      });
    });
  });
});
