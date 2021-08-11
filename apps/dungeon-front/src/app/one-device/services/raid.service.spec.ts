import { TestBed } from '@angular/core/testing';
import { mocked } from 'ts-jest/utils';
import { randomInteger } from '@into-the-dungeon/util-testing';

import { RaidService } from './raid.service';
import { UiMediatorService } from './ui-mediator.service';
import { 
  Raid, RaidParticipants, Player, Hero, WeaponName, Monster, MonsterType 
} from '../../models/models';
import { 
  PlayerDouble, HeroDouble, MonsterDouble, pickRandomWeaponNames
} from '../../models/test-doubles';

jest.mock('./ui-mediator.service.ts');

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
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(raidService).toBeTruthy();
  });

  describe('playRaid', () => {
    let participantsDummy: RaidParticipants;
    let raiderDummy: Player;
    let heroDummy: Hero;
    let enemiesDummy: Monster[];

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

      test('it does not request weaponChoice', async () => {
        expect.assertions(1);

        await raidService.playRaid(participantsDummy);
    
        expect(uiMediator.requestWeaponChoice)
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
      let enemyDummy: MonsterType;
      let weaponOptionsDummy: WeaponName[];

      beforeEach(() => {
        weaponOptionsDummy = pickRandomWeaponNames(randomInteger(4) + 2);
        const randomIndex = randomInteger(weaponOptionsDummy.length, false);
        const chosenWeaponDummy = weaponOptionsDummy[randomIndex];

        makeLoopRunTimes(1);

        jest.spyOn(Raid.prototype, 'getCurrentEncounter')
          .mockReturnValue({
            enemy: enemyDummy,
            weapons: weaponOptionsDummy
          });
        
        jest.spyOn(uiMediator, 'requestWeaponChoice')
          .mockResolvedValue(chosenWeaponDummy);
      });

      test('it requests weaponChoice after getCurrentEncounter', async () => {
        expect.assertions(1);

        await raidService.playRaid(participantsDummy);

        const [raidMock] = RaidMock.mock.instances;
    
        expect(uiMediator.requestWeaponChoice)
          .toHaveBeenCalledAfter(raidMock.getCurrentEncounter as jest.Mock);
      });

      test('weapon choice is requested to raider player', async () => {       
        expect.assertions(1);

        await raidService.playRaid(participantsDummy);
      
        expect(uiMediator.requestWeaponChoice)
          .toHaveBeenCalledWith(raiderDummy, expect.toBeArray());
      });

      test(
        'weapon choice is requested with options from getCurrentEncounter', 
        async () => {       
          expect.assertions(1);

          await raidService.playRaid(participantsDummy);
      
          expect(uiMediator.requestWeaponChoice)
            .toHaveBeenCalledWith(expect.toBeObject(), weaponOptionsDummy);
        }
      );

      test('it throws error if chosen weapon was not in options', async () => {
        const optionsDummy: WeaponName[] = ['smoke bomb', 'katana', 'dark stone'];
        const wrongChoice: WeaponName = 'royal sceptre';
        
        jest.spyOn(Raid.prototype, 'getCurrentEncounter')
          .mockReturnValue({
            enemy: 'orc',
            weapons: optionsDummy
          });

        jest.spyOn(uiMediator, 'requestWeaponChoice')
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
            .toHaveBeenCalledAfter(uiMediator.requestWeaponChoice as jest.Mock);
        }
      );

      test(
        'raid.resolveEncounter is called with chosen weapon from uiMediator', 
        async () => {
          const randomIndex = randomInteger(weaponOptionsDummy.length, false);
          const chosenWeapon = weaponOptionsDummy[randomIndex];
          
          jest.spyOn(uiMediator, 'requestWeaponChoice')
            .mockResolvedValue(chosenWeapon);

          expect.assertions(1);

          await raidService.playRaid(participantsDummy);
        
          const [raidMock] = RaidMock.mock.instances;
        
          expect(raidMock.resolveCurrentEncounter)
            .toHaveBeenCalledWith(chosenWeapon);
        }
      );
    });

    describe('return value', () => {
      let survivedDummy: boolean;

      beforeEach(() => {
        survivedDummy = Math.random() >= 0.5;

        jest.spyOn(Raid.prototype, 'hasHeroSurvived')
          .mockReturnValue(survivedDummy);
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

      test('it returns survived value from raid.hasHeroSurvived', async () => {
        expect.assertions(1);
  
        const raidResult = await raidService.playRaid(participantsDummy);

        expect(raidResult.survived).toBe(survivedDummy);
      });
    });
  });
});
