import { TestBed } from '@angular/core/testing';
import { randomInteger, randomString } from '@into-the-dungeon/util-testing';
import { UiMediatorService } from './ui-mediator.service';
import { HeroesService } from './heroes.service';
import { MonstersService } from './monsters.service';
import {
  AnyHeroViewData,
  BiddingActionRequestData,
  BiddingEndReason,
  BiddingStateViewData,
  EquipmentName,
  HeroType,
  heroTypes,
  heroViewDataMap,
  MonsterType,
  Player,
  PlayerRequirements,
  WeaponName
} from '../../models/models';
import {
  PlayerDouble,
  HeroDouble,
  MonsterDouble,
  pickRandomMonsterTypes,
  buildEquipmentViewDataDummy
} from '../../models/test-doubles';
import { Subject, Subscription } from 'rxjs';


jest.mock('./heroes.service');
jest.mock('./monsters.service');

function buildHeroOptionsDummy(): AnyHeroViewData[] {
  return heroTypes.reduce((options, type) => {
    const partialData = heroViewDataMap[type];
    const equipment = buildEquipmentViewDataDummy();

    options.push({ ...partialData, equipment });
    
    return options;
  }, [] as AnyHeroViewData[]);
}

function buildRequestStateDummy(): BiddingActionRequestData['state'] {
  return {
    dungeon: pickRandomMonsterTypes(4),
    hero: HeroDouble.createDouble(),
    remainingMonsters: randomInteger(7),
    remainingPlayers: randomInteger(4)
  };
}

describe('UiMediatorService', () => {
  let uiMediator: UiMediatorService;
  let heroesServiceMock: HeroesService;
  let monstersServiceMock: MonstersService;
  let playerDummy: Player;
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UiMediatorService,
        HeroesService,
        MonstersService
      ]
    });
    uiMediator = TestBed.inject(UiMediatorService);
    heroesServiceMock = TestBed.inject(HeroesService);
    monstersServiceMock = TestBed.inject(MonstersService);

    playerDummy = PlayerDouble.createDouble();
  });

  describe('instantiation and initial state', () => {
    test('it is created', () => {
      expect(uiMediator).toBeTruthy();
    });

    test('biddingEndNotification is a Subject but has not emitted yet', () => {
      jest.spyOn(uiMediator.biddingEndNotification, 'next');
      
      expect(uiMediator.biddingEndNotification).toBeInstanceOf(Subject);
      expect(uiMediator.biddingEndNotification.next).not.toHaveBeenCalled();
    });

    test('bidParticipationRequest is a Subject but has not emitted yet', () => {
      jest.spyOn(uiMediator.bidParticipationRequest, 'next');
      
      expect(uiMediator.bidParticipationRequest).toBeInstanceOf(Subject);
      expect(uiMediator.bidParticipationRequest.next).not.toHaveBeenCalled();
    });

    test(
      'forcibleMonsterAdditionNotif. is a Subject but has not emitted yet', 
      () => {
        jest.spyOn(uiMediator.biddingEndNotification, 'next');
        
        expect(uiMediator.biddingEndNotification).toBeInstanceOf(Subject);
        expect(uiMediator.biddingEndNotification.next).not.toHaveBeenCalled();
      }
    );

    test('heroChoiceRequest is a Subject but has not emitted yet', () => {
      jest.spyOn(uiMediator.heroChoiceRequest, 'next');
      
      expect(uiMediator.heroChoiceRequest).toBeInstanceOf(Subject);
      expect(uiMediator.heroChoiceRequest.next).not.toHaveBeenCalled();
    });
    
    test('playersRequest is a Subject but has not emitted yet', () => {
      jest.spyOn(uiMediator.playersRequest, 'next');
      
      expect(uiMediator.playersRequest).toBeInstanceOf(Subject);
      expect(uiMediator.playersRequest.next).not.toHaveBeenCalled();
    });
  });

  describe('notifyBiddingResult', () => {
    let raiderDummy: Player;
    let endReasonDummy: BiddingEndReason;

    beforeEach(() => {
      raiderDummy = PlayerDouble.createDouble();
      endReasonDummy = 'last-bidding-player';

      // fake reception confirmation
      subscription = uiMediator.biddingEndNotification
        .subscribe(notification => {
          notification.resolve(true);
        });
    });

    test('it emits notification with expected properties', async () => {
      jest.spyOn(uiMediator.biddingEndNotification, 'next');
      
      expect.assertions(2);

      await uiMediator.notifyBiddingResult(raiderDummy, endReasonDummy);

      expect(uiMediator.biddingEndNotification.next)
        .toHaveBeenCalledTimes(1);
      expect(uiMediator.biddingEndNotification.next)
        .toHaveBeenCalledWith(expect.objectContaining({
          content: expect.objectContaining({
            raider: raiderDummy.name,
            endReason: endReasonDummy,
          }),
          resolve: expect.toBeFunction()
        }));
    });

    test('notification.resolve makes method resolve', () => {
      subscription.unsubscribe();
      const returnedPromise = uiMediator
        .notifyBiddingResult(raiderDummy, endReasonDummy);

      expect(returnedPromise).not.toResolve();

      uiMediator.biddingEndNotification.subscribe(notification => {
        notification.resolve(true);
      });

      expect(returnedPromise).toResolve();
    });
  });

  describe('notifyForcibleMonsterAddition', () => {
    let playerDummy: Player;
    let monsterDummy: MonsterType;

    beforeEach(() => {
      playerDummy = PlayerDouble.createDouble();
      monsterDummy = pickRandomMonsterTypes(1)[0];

      // fake reception confirmation
      subscription = uiMediator.forcibleMonsterAdditionNotification
        .subscribe(notification => {
          notification.resolve(true);
        });
    });

    test('it asks monstersService for view data of added monster', async () => {
      expect.assertions(1);

      await uiMediator.notifyForcibleMonsterAddition(playerDummy, monsterDummy);

      expect(monstersServiceMock.getViewDataFor)
        .toHaveBeenCalledWith(monsterDummy);
    });

    test('it emits notification with expected properties', async () => {
      const monsterViewDataDummy = MonsterDouble.createViewDataDouble()

      jest.spyOn(uiMediator.forcibleMonsterAdditionNotification, 'next');
      jest.spyOn(monstersServiceMock, 'getViewDataFor')
        .mockReturnValue(monsterViewDataDummy);
      
      expect.assertions(2);

      await uiMediator.notifyForcibleMonsterAddition(playerDummy, monsterDummy);

      expect(uiMediator.forcibleMonsterAdditionNotification.next)
        .toHaveBeenCalledTimes(1);
      expect(uiMediator.forcibleMonsterAdditionNotification.next)
        .toHaveBeenCalledWith(expect.objectContaining({
          content: expect.objectContaining({
            player: playerDummy.name,
            monster: monsterViewDataDummy
          }),
          resolve: expect.toBeFunction()
        }));
    });

    test('notification.resolve makes method resolve', () => {
      subscription.unsubscribe();
      const returnedPromise = uiMediator
        .notifyForcibleMonsterAddition(playerDummy, monsterDummy);

      expect(returnedPromise).not.toResolve();

      uiMediator.forcibleMonsterAdditionNotification.subscribe(notification => {
        notification.resolve(true);
      });

      expect(returnedPromise).toResolve();
    });
  });

  describe.each([
    true, false
  ])('requestBidParticipation (accepted: %s)', decisionDummy => {
    let stateDummy: BiddingActionRequestData['state'];

    beforeEach(() => {
      stateDummy = buildRequestStateDummy();

      // fake participation acceptance/rejection
      subscription = uiMediator.bidParticipationRequest.subscribe(request => {
        request.resolve(decisionDummy);
      });
    });

    test('it asks HeroesService for Hero view data', async () => {
      expect.assertions(2);

      await uiMediator.requestBidParticipation(playerDummy, stateDummy);

      expect(heroesServiceMock.getPlayingHeroViewData).toHaveBeenCalledTimes(1);
      expect(heroesServiceMock.getPlayingHeroViewData)
        .toHaveBeenCalledWith(stateDummy.hero);
    });

    test('it asks MonsterService for Monster view data', async () => {   
      expect.assertions(1 + stateDummy.dungeon.length);

      await uiMediator.requestBidParticipation(playerDummy, stateDummy);

      expect(monstersServiceMock.getViewDataFor)
        .toHaveBeenCalledTimes(stateDummy.dungeon.length);
      stateDummy.dungeon.forEach((monster, index) => {
        expect(monstersServiceMock.getViewDataFor)
          .toHaveBeenNthCalledWith(index + 1, monster);
      });
    });

    test(
      'it emits BidParticipationRequest with expected properties', 
      async () => {
        const heroViewDataDummy = HeroDouble.createPlayingHeroViewDataDouble();

        jest.spyOn(uiMediator.bidParticipationRequest, 'next');
        jest.spyOn(heroesServiceMock, 'getPlayingHeroViewData')
          .mockReturnValue(heroViewDataDummy);
        const getMonsterViewDataSpy = jest
          .spyOn(monstersServiceMock, 'getViewDataFor')
          .mockImplementation(() => MonsterDouble.createViewDataDouble());

        expect.assertions(2);

        await uiMediator.requestBidParticipation(playerDummy, stateDummy);

        const dungeonViewDataDummy = getMonsterViewDataSpy.mock.results
          .map(result => result.value);

        const expectedState: BiddingStateViewData = {
          dungeon: dungeonViewDataDummy,
          hero: heroViewDataDummy,
          remainingMonsters: stateDummy.remainingMonsters,
          remainingPlayers: stateDummy.remainingPlayers
        };

        expect(uiMediator.bidParticipationRequest.next).toHaveBeenCalledTimes(1);
        expect(uiMediator.bidParticipationRequest.next)
          .toHaveBeenCalledWith(expect.objectContaining({
            content: expect.objectContaining({
              player: playerDummy.name,
              state: expectedState,
            }),
            resolve: expect.toBeFunction()
          }));
      }
    );

    test('request.resolve makes method resolve', () => {
      subscription.unsubscribe();
      const returnedPromise = uiMediator
        .requestBidParticipation(playerDummy, stateDummy);

      expect(returnedPromise).not.toResolve();

      uiMediator.biddingEndNotification.subscribe(request => {
        request.resolve(true);
      });

      expect(returnedPromise).toResolve();
    });

    test('it returns response to request', async () => {
      expect.assertions(1);

      const response 
        = await uiMediator.requestBidParticipation(playerDummy, stateDummy);

      expect(response).toBe(decisionDummy);
    });
  });

  describe('requestEquipmentRemoval', () => {
    test('it returns a string', async () => {
      const optionsDummy: EquipmentName[] = [];

      expect.assertions(1);

      const itemName = 
        await uiMediator.requestEquipmentRemoval(playerDummy, optionsDummy);

      expect(itemName).toBeString();
    });
  });

  describe('requestHeroChoice', () => {
    let chosenHeroDummy: HeroType;
    let heroOptionsDummy: AnyHeroViewData[];

    beforeEach(() => {
      chosenHeroDummy = 'bard';
      heroOptionsDummy = buildHeroOptionsDummy();

      // fake hero choice
      uiMediator.heroChoiceRequest.subscribe(request => {
        request.resolve(chosenHeroDummy);
      });
      
      jest.spyOn(heroesServiceMock, 'getHeroOptions')
        .mockReturnValue(heroOptionsDummy);
    });

    test('it asks HeroesService for Hero options', async () => {
      expect.assertions(1);

      await uiMediator.requestHeroChoice(playerDummy);

      expect(heroesServiceMock.getHeroOptions).toHaveBeenCalled();
    });

    test('it emits HeroChoiceRequest with expected properties', async () => {      
      jest.spyOn(uiMediator.heroChoiceRequest, 'next');

      expect.assertions(2);

      await uiMediator.requestHeroChoice(playerDummy);

      expect(uiMediator.heroChoiceRequest.next).toHaveBeenCalledTimes(1);
      expect(uiMediator.heroChoiceRequest.next)
        .toHaveBeenCalledWith(expect.objectContaining({
          content: expect.objectContaining({
            player: playerDummy.name,
            options: expect.arrayContaining(heroOptionsDummy)
          }),
          resolve: expect.toBeFunction()
        }));
    });

    test('it asks HeroesService to create chosen Hero', async () => {
      expect.assertions(1);

      await uiMediator.requestHeroChoice(playerDummy);

      expect(heroesServiceMock.createHero).toHaveBeenCalledWith(chosenHeroDummy);
    });

    test('request.resolve makes method resolve', () => {
      subscription.unsubscribe();
      const returnedPromise = uiMediator.requestHeroChoice(playerDummy);

      expect(returnedPromise).not.toResolve();

      uiMediator.heroChoiceRequest.subscribe(request => {
        request.resolve('mage');
      });

      expect(returnedPromise).toResolve();
    });

    test('it returns hero created by HeroesService', async () => {
      const heroDummy = HeroDouble.createDouble();
      jest.spyOn(heroesServiceMock, 'createHero').mockReturnValue(heroDummy);

      expect.assertions(1);

      const hero = await uiMediator.requestHeroChoice(playerDummy);

      expect(hero).toBe(heroDummy);
    });
  });

  describe('requestMonsterAddition', () => {
    test('it returns a boolean', async () => {
      const [monsterNameDummy] = pickRandomMonsterTypes(1);

      expect.assertions(1);

      const response = 
        await uiMediator.requestMonsterAddition(playerDummy, monsterNameDummy);

      expect(response).toBeBoolean();
    });
  });

  describe('requestPlayers', () => {
    let rangeDummy: PlayerRequirements;
    let addedPlayersDummy: string[];

    beforeEach(() => {
      const min = randomInteger(4);
      const max = min + 5;
      rangeDummy = { min, max };
      addedPlayersDummy = [randomString(6), randomString(5), randomString(8)];
      
      // fake players addition
      uiMediator.playersRequest.subscribe(request => {
        request.resolve(addedPlayersDummy);
      });
    });

    test('it emits PlayersRequest with expected properties', async () => {      
      jest.spyOn(uiMediator.playersRequest, 'next');

      expect.assertions(2);

      await uiMediator.requestPlayers(rangeDummy);

      expect(uiMediator.playersRequest.next).toHaveBeenCalledTimes(1);
      expect(uiMediator.playersRequest.next)
        .toHaveBeenCalledWith(expect.objectContaining({
          content: expect.objectContaining({
            range: [rangeDummy.min, rangeDummy.max],
          }),
          resolve: expect.toBeFunction()
        }));
    });

    test('request.resolve makes method resolve', () => {
      subscription.unsubscribe();
      const returnedPromise = uiMediator.requestPlayers(rangeDummy);

      expect(returnedPromise).not.toResolve();

      uiMediator.playersRequest.subscribe(request => {
        request.resolve([]);
      });

      expect(returnedPromise).toResolve();
    });

    test('it returns players with added players\' names', async () => {
      expect.assertions(1);

      const players = await uiMediator.requestPlayers(rangeDummy);
      const playerNames = players.map(player => player.name);

      expect(playerNames).toIncludeSameMembers(addedPlayersDummy);
    });
  });

  describe('requestWeaponChoice', () => {
    test('it returns a string', async () => {
      const optionsDummy: WeaponName[] = [];

      expect.assertions(1);

      const itemName = 
        await uiMediator.requestWeaponChoice(playerDummy, optionsDummy);

      expect(itemName).toBeString();
    });
  });
});
