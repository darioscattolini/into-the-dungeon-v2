import { TestBed } from '@angular/core/testing';
import { mocked } from 'ts-jest/utils';
import { randomInteger } from '@into-the-dungeon/util-testing';

import { BiddingService } from './bidding.service';
import { UiMediatorService } from './ui-mediator.service';
import { MonstersService } from './monsters.service';
import {
  Player,
  Hero,
  EquipmentName,
  Monster,
  AnyMonster,
  MonsterType,
  Bidding,
  BiddingPlayersRound,
  BiddingEndReason,
  BiddingActionRequestData
} from '../../models/models';
import {
  PlayerDouble,
  BiddingPlayersRoundDouble,
  HeroDouble,
  MonsterDouble,
  buildRequestStateDataDummy,
  EquipmentDouble,
} from '../../models/test-doubles';

jest.mock('./ui-mediator.service');
jest.mock('./monsters.service');

jest.mock('../../models/game-mechanics/bidding/bidding');
const BiddingMock = mocked(Bidding);

jest.mock('../../models/game-mechanics/bidding/bidding-players-round');

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
  let raiderDummy: Player;
  let heroDummy: Hero;
  let enemiesDummy: AnyMonster[];

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

    raiderDummy = PlayerDouble.createDouble();
    heroDummy = HeroDouble.createDouble();
    enemiesDummy = [
      MonsterDouble.createDouble(), 
      MonsterDouble.createDouble(),
      MonsterDouble.createDouble()
    ];

    jest.spyOn(Bidding.prototype, 'onResponse').mockReturnValue({});

    jest.spyOn(Bidding.prototype, 'getResult')
      .mockReturnValue({
        endReason: 'no-monsters',
        raider: raiderDummy, 
        hero: heroDummy, 
        enemies: enemiesDummy 
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    BiddingMock.mockRestore();
  });

  it('should be created', () => {
    expect(biddingService).toBeTruthy();
  });

  describe('playBidding', () => {
    let playersDummy: BiddingPlayersRound;
    let requestTargetDummy: Player;
    let monstersPackDummy: AnyMonster[];
    let stateDataDummy: BiddingActionRequestData['state'];
    let actionRequestGenericDummy: BiddingActionRequestData;

    beforeEach(() => {
      playersDummy = BiddingPlayersRoundDouble.createDouble();
      requestTargetDummy = PlayerDouble.createDouble();
      monstersPackDummy = [
        MonsterDouble.createDouble(),
        MonsterDouble.createDouble(),
        MonsterDouble.createDouble()
      ];
      stateDataDummy = buildRequestStateDataDummy();
      actionRequestGenericDummy = {
        action: 'play-bidding',
        player: requestTargetDummy,
        content: undefined,
        state: stateDataDummy
      };

      jest.spyOn(uiMediator, 'requestHeroChoice').mockResolvedValue(heroDummy);
      jest.spyOn(monstersService, 'getMonstersPack')
        .mockReturnValue(monstersPackDummy);
    });

    test('Hero is chosen by starting player', async () => {
      makeLoopRunTimes(0);

      const starterDummy = PlayerDouble.createDouble();

      jest.spyOn(BiddingPlayersRound.prototype, 'getCurrentPlayer')
        .mockReturnValue(starterDummy);

      expect.assertions(1);

      await biddingService.playBidding(playersDummy);

      expect(uiMediator.requestHeroChoice).toHaveBeenCalledWith(starterDummy);
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
      // stubbed dependency
      jest.spyOn(Bidding.prototype, 'getActionRequestData')
        .mockReturnValue(actionRequestGenericDummy);

      makeLoopRunTimes(3);

      expect.assertions(1);

      await biddingService.playBidding(playersDummy);

      expect(Bidding).toHaveBeenCalledTimes(1);
    });

    test('loop runs as many times as bidding.goesOn is true', async () => {
      // stubbed dependency
      jest.spyOn(Bidding.prototype, 'getActionRequestData')
        .mockReturnValue(actionRequestGenericDummy);

      const times = randomInteger(5) + 2;
      makeLoopRunTimes(times);

      expect.assertions(1);

      await biddingService.playBidding(playersDummy);

      const [biddingMock] = BiddingMock.mock.instances;

      expect(biddingMock.getActionRequestData).toHaveBeenCalledTimes(times);
    });

    describe('loop run for bid participation (play-bidding)', () => {
      let requestDataDummy: BiddingActionRequestData;

      beforeEach(() => {
        requestDataDummy = {
          action: 'play-bidding',
          player: requestTargetDummy,
          content: undefined,
          state: stateDataDummy
        };

        makeLoopRunTimes(1);

        jest.spyOn(Bidding.prototype, 'getActionRequestData')
          .mockReturnValue(requestDataDummy);
      });

      test('it requests bid participation after getActionRequestData', async () => {
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        const [biddingMock] = BiddingMock.mock.instances;
    
        expect(uiMediator.requestBidParticipation)
          .toHaveBeenCalledAfter(biddingMock.getActionRequestData as jest.Mock);
      });

      test(
        'bid participation is requested with data from getActionRequestData', 
        async () => {
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
      
          expect(uiMediator.requestBidParticipation)
            .toHaveBeenCalledWith(
              requestDataDummy.player, requestDataDummy.state
            );
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

      test('bidding.onResponse is called with play-bidding action', async () => {
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);
      
        const [biddingMock] = BiddingMock.mock.instances;
      
        expect(biddingMock.onResponse)
          .toHaveBeenCalledWith(
            expect.toContainEntry(
              ['action', 'play-bidding']
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

      test('it notifies nothing on empty onResponse notification', async () => {
        jest.spyOn(Bidding.prototype, 'onResponse').mockReturnValue({});
        
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        expect(uiMediator.notifyForcibleMonsterAddition).not.toHaveBeenCalled();
      });

      test('it notifies on forcibleMonsterAddition', async () => {
        const notificationDataDummy = {
          player: PlayerDouble.createDouble(),
          forciblyAddedMonster: 'goblin' as MonsterType
        };

        jest.spyOn(Bidding.prototype, 'onResponse')
          .mockReturnValue({ notification: notificationDataDummy });

        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        expect(uiMediator.notifyForcibleMonsterAddition)
          .toHaveBeenCalledWith(
            notificationDataDummy.player,
            notificationDataDummy.forciblyAddedMonster
          );
      });
    });

    describe('loop run for monster addition (add-monster)', () => {
      let monsterTypeDummy: MonsterType;

      beforeEach(() => {
        [monsterTypeDummy] = MonsterDouble.pickTypes(1);

        makeLoopRunTimes(1);

        jest.spyOn(Bidding.prototype, 'getActionRequestData')
          .mockReturnValue({
            action: 'add-monster',
            player: requestTargetDummy,
            content: monsterTypeDummy,
            state: stateDataDummy
          });
      });

      test('it requests monster addition after getActionRequestData', async () => {
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        const [biddingMock] = BiddingMock.mock.instances;
    
        expect(uiMediator.requestMonsterAddition)
          .toHaveBeenCalledAfter(biddingMock.getActionRequestData as jest.Mock);
      });

      test(
        'monster addition is requested with data from getActionRequestData', 
        async () => {
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
      
          expect(uiMediator.requestMonsterAddition)
            .toHaveBeenCalledWith(
              requestTargetDummy, 
              monsterTypeDummy, 
              stateDataDummy
            );
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

      test('bidding.onResponse is called with add-monster action', async () => {
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);
      
        const [biddingMock] = BiddingMock.mock.instances;
      
        expect(biddingMock.onResponse)
          .toHaveBeenCalledWith(
            expect.toContainEntry(
              ['action', 'add-monster']
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

      test('it notifies nothing on empty onResponse notification', async () => {
        jest.spyOn(Bidding.prototype, 'onResponse').mockReturnValue({});
        
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        expect(uiMediator.notifyForcibleMonsterAddition).not.toHaveBeenCalled();
      });

      test('it notifies on forcibleMonsterAddition', async () => {
        const notificationDataDummy = {
          player: PlayerDouble.createDouble(),
          forciblyAddedMonster: 'goblin' as MonsterType
        };

        jest.spyOn(Bidding.prototype, 'onResponse')
          .mockReturnValue({ notification: notificationDataDummy });

        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        expect(uiMediator.notifyForcibleMonsterAddition)
          .toHaveBeenCalledWith(
            notificationDataDummy.player,
            notificationDataDummy.forciblyAddedMonster
          );
      });
    });

    describe('loop run for equipment removal (remove-equipment)', () => {
      let equipmentOptionsDummy: EquipmentName[];
      let chosenEquipmentDummy: EquipmentName;

      beforeEach(() => {
        equipmentOptionsDummy = EquipmentDouble.pickNames(4);
        const randomIndex = randomInteger(equipmentOptionsDummy.length, false);
        chosenEquipmentDummy = equipmentOptionsDummy[randomIndex];

        makeLoopRunTimes(1);

        jest.spyOn(stateDataDummy.hero, 'getMountedEquipment')
          .mockReturnValue(equipmentOptionsDummy);

        jest.spyOn(Bidding.prototype, 'getActionRequestData')
          .mockReturnValue({
            action: 'remove-equipment',
            player: requestTargetDummy,
            state: stateDataDummy
          });

        jest.spyOn(uiMediator, 'requestEquipmentRemoval')
          .mockResolvedValue(chosenEquipmentDummy);
      });

      test('it requests equipment removal after getActionRequestData', async () => {
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        const [biddingMock] = BiddingMock.mock.instances;
    
        expect(uiMediator.requestEquipmentRemoval)
          .toHaveBeenCalledAfter(biddingMock.getActionRequestData as jest.Mock);
      });

      test(
        'equipment removal is requested with data from getActionRequestData', 
        async () => {
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
      
          expect(uiMediator.requestEquipmentRemoval)
            .toHaveBeenCalledWith(requestTargetDummy, stateDataDummy);
        }
      );

      test('it throws error if chosen equipment wasnt in options', async () => {
        const optionsDummy: EquipmentName[] = ['chaperone', 'katana', 'suitor'];
        const wrongChoice: EquipmentName = 'royal sceptre';

        jest.spyOn(stateDataDummy.hero, 'getMountedEquipment')
          .mockReturnValue(optionsDummy);
        
        jest.spyOn(Bidding.prototype, 'getActionRequestData')
          .mockReturnValue({
            action: 'remove-equipment',
            player: requestTargetDummy,
            state: stateDataDummy
          });

        jest.spyOn(uiMediator, 'requestEquipmentRemoval')
          .mockResolvedValue(wrongChoice);
          
        expect.assertions(1);
  
        await expect(biddingService.playBidding(playersDummy))
          .rejects
          .toThrow('Chosen equipment not included among eligible options');
      });

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
        'bidding.onResponse is called with remove-equipment action', 
        async () => {
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
        
          const [biddingMock] = BiddingMock.mock.instances;
        
          expect(biddingMock.onResponse)
            .toHaveBeenCalledWith(
              expect.toContainEntry(
                ['action', 'remove-equipment']
              )
            );
        }
      );

      test(
        'bidding.onResponse is called with chosen equipment from uiMediator', 
        async () => {
          expect.assertions(1);

          await biddingService.playBidding(playersDummy);
        
          const [biddingMock] = BiddingMock.mock.instances;
        
          expect(biddingMock.onResponse)
            .toHaveBeenCalledWith(
              expect.toContainEntry(
                ['content', chosenEquipmentDummy]
              )
            );
        }
      );

      test('it notifies nothing on empty onResponse notification', async () => {
        jest.spyOn(Bidding.prototype, 'onResponse').mockReturnValue({});
        
        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        expect(uiMediator.notifyForcibleMonsterAddition).not.toHaveBeenCalled();
      });

      test('it notifies on forcibleMonsterAddition', async () => {
        const notificationDataDummy = {
          player: PlayerDouble.createDouble(),
          forciblyAddedMonster: 'goblin' as MonsterType
        };

        jest.spyOn(Bidding.prototype, 'onResponse')
          .mockReturnValue({ notification: notificationDataDummy });

        expect.assertions(1);

        await biddingService.playBidding(playersDummy);

        expect(uiMediator.notifyForcibleMonsterAddition)
          .toHaveBeenCalledWith(
            notificationDataDummy.player,
            notificationDataDummy.forciblyAddedMonster
          );
      });
    });

    describe('end of bidding and return value', () => {
      test.each(['last-bidding-player', 'no-monsters'] as BiddingEndReason[])(
        'it sends notification of bidding result', 
        async endReason => {
          jest.spyOn(Bidding.prototype, 'getResult').mockReturnValue({
            endReason: endReason,
            raider: raiderDummy, 
            hero: heroDummy, 
            enemies: enemiesDummy 
          });

          expect.assertions(1);
    
          await biddingService.playBidding(playersDummy);

          expect(uiMediator.notifyBiddingResult)
            .toHaveBeenCalledWith(raiderDummy, endReason);
        }
      );

      test('it is an instance of BiddingResult', async () => {
        expect.assertions(5);
  
        const biddingResult = await biddingService.playBidding(playersDummy);
  
        expect(biddingResult).toContainKeys(['raider', 'hero', 'enemies']);

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
