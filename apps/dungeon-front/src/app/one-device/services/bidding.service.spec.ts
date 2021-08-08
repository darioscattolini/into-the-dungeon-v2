import { TestBed } from '@angular/core/testing';
import { mocked } from 'ts-jest/utils';
import { randomInteger } from '@into-the-dungeon/util-testing';

import { BiddingService } from './bidding.service';
import { UiMediatorService } from './ui-mediator.service';
import { MonstersService } from './monsters.service';
import { 
  Player, BiddingPlayersRound, Bidding,
  Hero, EquipmentName, Monster, MonsterType
} from '../../models/models';
import { 
  PlayerDouble, BiddingPlayersRoundDouble, 
  HeroDouble, pickRandomEquipmentNames, MonsterDouble, pickRandomMonsterTypes
} from '../../models/test-doubles';

jest.mock('./ui-mediator.service.ts');
jest.mock('./monsters.service.ts');

jest.mock('../../models/game-mechanics/bidding.ts')
const BiddingMock = mocked(Bidding);

function makeLoopRunTimes(times: number): void {
  let loopController = jest.spyOn(Bidding.prototype, 'goesOn')
    .mockReturnValue(false);

  for (let i = 0; i < times; i++) {
    loopController = loopController.mockReturnValueOnce(true);
  }
}

describe('BiddingService', () => {
  let biddingService: BiddingService;
  let uiMediator: UiMediatorService;
  let monstersService: MonstersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BiddingService,
        UiMediatorService,
        MonstersService
      ]
    });

    biddingService = TestBed.inject(BiddingService);
    uiMediator = TestBed.inject(UiMediatorService);
    monstersService = TestBed.inject(MonstersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(biddingService).toBeTruthy();
  });

  describe('playBidding', () => {
    let playersDummy: BiddingPlayersRound;
    let heroDummy: Hero;
    let monstersPackDummy: Monster[];

    beforeEach(() => {
      playersDummy = BiddingPlayersRoundDouble.createDouble();
      heroDummy = HeroDouble.createDouble();
      monstersPackDummy = [
        MonsterDouble.createDouble(),
        MonsterDouble.createDouble()
      ];

      jest.spyOn(uiMediator, 'requestHeroChoice').mockResolvedValue(heroDummy);
      jest.spyOn(monstersService, 'getMonstersPack')
        .mockReturnValue(monstersPackDummy);

      // move to tests requiring this
      jest.spyOn(Bidding.prototype, 'getActionRequest')
        .mockReturnValue({
          type: 'play-bidding',
          player: PlayerDouble.createDouble()
        });
    });

    test('Bidding is instantiated with the right parameters', async () => {
      makeLoopRunTimes(0);

      const expectedParameters: ConstructorParameters<typeof Bidding> = [
        playersDummy,     // parameter passed to biddingService.playBidding
        heroDummy,        // parameter from uiService.requestHeroChoice
        monstersPackDummy // parameter from mosntersService.getMonstersPack
      ];

      expect.assertions(1);

      await biddingService.playBidding(playersDummy);

      expect(Bidding).toHaveBeenCalledWith(...expectedParameters);
    });

    test('Bidding is instantiated only once', async () => {
      makeLoopRunTimes(3);

      expect.assertions(1);

      await biddingService.playBidding(playersDummy);

      expect(Bidding).toHaveBeenCalledTimes(1);
    });

    test('loop runs as many times as bidding.goesOn is true', async () => {
      const times = randomInteger(5) + 2;
      makeLoopRunTimes(times);

      expect.assertions(1);

      await biddingService.playBidding(playersDummy);

      const [biddingMock] = BiddingMock.mock.instances;

      expect(biddingMock.getActionRequest).toHaveBeenCalledTimes(times);
    });

    describe('loop run for bid participation (play-bidding)', () => {
      let requestTargetDummy: Player;

      beforeEach(() => {
        requestTargetDummy = PlayerDouble.createDouble();

        makeLoopRunTimes(1);

        jest.spyOn(Bidding.prototype, 'getActionRequest')
          .mockReturnValue({
            type: 'play-bidding',
            player: requestTargetDummy
          });
      });

      test('it requests bid participation after getActionRequest', async () => {
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        const [biddingMock] = BiddingMock.mock.instances;
    
        expect(uiMediator.requestBidParticipation)
          .toHaveBeenCalledAfter(biddingMock.getActionRequest as jest.Mock);
      });

      test(
        'bid participation is requested to player from getActionRequest', 
        async () => {       
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
      
          expect(uiMediator.requestBidParticipation)
            .toHaveBeenCalledWith(requestTargetDummy);
        }
      );

      test(
        'it calls bidding.onResponse after requesting participation', 
        async () => {
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);

          const [biddingMock] = BiddingMock.mock.instances;
      
          expect(biddingMock.onResponse)
            .toHaveBeenCalledAfter(
              uiMediator.requestBidParticipation as jest.Mock
            );
        }
      );

      test('bidding.onResponse is called with play-bidding type', async () => {
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);
      
        const [biddingMock] = BiddingMock.mock.instances;
      
        expect(biddingMock.onResponse)
          .toHaveBeenCalledWith(
            expect.toContainEntry(
              ['type', 'play-bidding']
            )
          );
      });

      test.each([true, false])(
        'bidding.onResponse is called with %s response from uiMediator', 
        async (response) => {
          jest.spyOn(uiMediator, 'requestBidParticipation')
            .mockResolvedValue(response);

          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
        
          const [biddingMock] = BiddingMock.mock.instances;
        
          expect(biddingMock.onResponse)
            .toHaveBeenCalledWith(
              expect.toContainEntry(
                ['content', response]
              )
            );
        }
      );
    });

    describe('loop run for monster addition (add-monster)', () => {
      let requestTargetDummy: Player;
      let monsterTypeDummy: MonsterType;

      beforeEach(() => {
        requestTargetDummy = PlayerDouble.createDouble();
        [monsterTypeDummy] = pickRandomMonsterTypes(1);

        makeLoopRunTimes(1);

        jest.spyOn(Bidding.prototype, 'getActionRequest')
          .mockReturnValue({
            type: 'add-monster',
            player: requestTargetDummy,
            content: monsterTypeDummy
          });
      });

      test('it requests monster addition after getActionRequest', async () => {
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        const [biddingMock] = BiddingMock.mock.instances;
    
        expect(uiMediator.requestMonsterAddition)
          .toHaveBeenCalledAfter(biddingMock.getActionRequest as jest.Mock);
      });

      test(
        'monster addition is requested to player from getActionRequest', 
        async () => {       
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
      
          expect(uiMediator.requestMonsterAddition)
            .toHaveBeenCalledWith(requestTargetDummy, expect.toBeString());
        }
      );

      test(
        'monster addition is requested for monster from getActionRequest', 
        async () => {       
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
      
          expect(uiMediator.requestMonsterAddition)
            .toHaveBeenCalledWith(expect.toBeObject(), monsterTypeDummy);
        }
      );

      test(
        'it calls bidding.onResponse after requesting monster addition', 
        async () => {
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);

          const [biddingMock] = BiddingMock.mock.instances;
      
          expect(biddingMock.onResponse)
            .toHaveBeenCalledAfter(
              uiMediator.requestMonsterAddition as jest.Mock
            );
        }
      );

      test('bidding.onResponse is called with add-monster type', async () => {
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);
      
        const [biddingMock] = BiddingMock.mock.instances;
      
        expect(biddingMock.onResponse)
          .toHaveBeenCalledWith(
            expect.toContainEntry(
              ['type', 'add-monster']
            )
          );
      });

      test.each([true, false])(
        'bidding.onResponse is called with %s response from uiMediator', 
        async (response) => {
          jest.spyOn(uiMediator, 'requestMonsterAddition')
            .mockResolvedValue(response);

          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
        
          const [biddingMock] = BiddingMock.mock.instances;
        
          expect(biddingMock.onResponse)
            .toHaveBeenCalledWith(
              expect.toContainEntry(
                ['content', response]
              )
            );
        }
      );
    });

    describe('loop run for equipment removal (remove-equipment)', () => {
      let requestTargetDummy: Player;
      let equipmentOptionsDummy: EquipmentName[];

      beforeEach(() => {
        requestTargetDummy = PlayerDouble.createDouble();
        equipmentOptionsDummy = pickRandomEquipmentNames(randomInteger(4) + 2);

        makeLoopRunTimes(1);

        jest.spyOn(Bidding.prototype, 'getActionRequest')
          .mockReturnValue({
            type: 'remove-equipment',
            player: requestTargetDummy,
            content: equipmentOptionsDummy
          });
      });

      test('it requests equipment removal after getActionRequest', async () => {
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        const [biddingMock] = BiddingMock.mock.instances;
    
        expect(uiMediator.requestEquipmentRemoval)
          .toHaveBeenCalledAfter(biddingMock.getActionRequest as jest.Mock);
      });

      test(
        'equipment removal is requested to player from getActionRequest', 
        async () => {       
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
      
          expect(uiMediator.requestEquipmentRemoval)
            .toHaveBeenCalledWith(requestTargetDummy, expect.toBeArray());
        }
      );

      test(
        'equipment removal is requested with options from getActionRequest', 
        async () => {       
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
      
          expect(uiMediator.requestEquipmentRemoval)
            .toHaveBeenCalledWith(expect.toBeObject(), equipmentOptionsDummy);
        }
      );

      test(
        'it calls bidding.onResponse after requesting equipment removal', 
        async () => {
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);

          const [biddingMock] = BiddingMock.mock.instances;
      
          expect(biddingMock.onResponse)
            .toHaveBeenCalledAfter(
              uiMediator.requestEquipmentRemoval as jest.Mock
            );
        }
      );

      test(
        'bidding.onResponse is called with remove-equipment type', 
        async () => {
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
        
          const [biddingMock] = BiddingMock.mock.instances;
        
          expect(biddingMock.onResponse)
            .toHaveBeenCalledWith(
              expect.toContainEntry(
                ['type', 'remove-equipment']
              )
            );
        }
      );

      test(
        'bidding.onResponse is called with chosen equipment from uiMediator', 
        async () => {
          const [chosenEquipment] = pickRandomEquipmentNames(1)
          
          jest.spyOn(uiMediator, 'requestEquipmentRemoval')
            .mockResolvedValue(chosenEquipment);

          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
        
          const [biddingMock] = BiddingMock.mock.instances;
        
          expect(biddingMock.onResponse)
            .toHaveBeenCalledWith(
              expect.toContainEntry(
                ['content', chosenEquipment]
              )
            );
        }
      );
    });

    describe('return value', () => {
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

        jest.spyOn(Bidding.prototype, 'getResult')
          .mockReturnValue({ 
            raider: raiderDummy, 
            hero: heroDummy, 
            enemies: enemiesDummy 
          });
      });

      test('it is an instance of BiddingResult', async () => {
        expect.assertions(5);
  
        const biddingResult = await biddingService.playBidding(playersDummy);
  
        expect(biddingResult).toContainAllKeys(['raider', 'hero', 'enemies']);
        expect(biddingResult.raider).toBeInstanceOf(Player);
        expect(biddingResult.hero).toBeInstanceOf(Hero);
        expect(biddingResult.enemies).toBeArray();
        expect(biddingResult.enemies).toSatisfyAll(e => e instanceof Monster);
      });

      test('it returns raider from bidding.getResult', async () => {
        expect.assertions(1);
  
        const biddingResult = await biddingService.playBidding(playersDummy);

        expect(biddingResult.raider).toBe(raiderDummy);
      });

      test('it returns hero from bidding.getResult', async () => {
        expect.assertions(1);
  
        const biddingResult = await biddingService.playBidding(playersDummy);

        expect(biddingResult.hero).toBe(heroDummy);
      });

      test('it returns enemies from bidding.getResult', async () => {
        expect.assertions(1);
  
        const biddingResult = await biddingService.playBidding(playersDummy);

        expect(biddingResult.enemies).toBe(enemiesDummy);
      });
    });
  });
});