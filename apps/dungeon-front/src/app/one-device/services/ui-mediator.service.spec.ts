import { TestBed } from '@angular/core/testing';
import { randomInteger, randomString } from '@into-the-dungeon/util-testing';

import { UiMediatorService } from './ui-mediator.service';
import { HeroesService } from './heroes.service';
import { MonstersService } from './monsters.service';
import { 
  Player, PlayerRequirements, 
  BiddingEndReason,
  BiddingActionRequestData, BidParticipationRequestData, BiddingStateViewData,
  HeroType, AnyHeroViewData, heroTypes, heroViewDataMap, PlayingHeroViewData,
  EquipmentName, WeaponName, MonsterType, MonsterViewData, monsterViewDataMap
} from '../../models/models';
import { 
  PlayerDouble, HeroDouble, pickRandomMonsterTypes, buildEquipmentViewDataDummy, MonsterDouble
} from '../../models/test-doubles';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

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

function fakeBidParticipationDecision(
  decision: boolean, uiMediator: UiMediatorService
) {
  uiMediator.bidParticipationRequest.subscribe(request => {
    request.resolve(decision);
  });
}

function fakeHeroChoice(chosenOption: HeroType, uiMediator: UiMediatorService) {
  uiMediator.heroChoiceRequest.subscribe(request => {
    request.resolve(chosenOption);
  });
}

function fakePlayerAddition(names: string[], uiMediator: UiMediatorService) {
  uiMediator.playersRequest.subscribe(request => {
    request.resolve(names);
  });
}

describe('UiMediatorService', () => {
  let uiMediator: UiMediatorService;
  let heroesServiceMock: HeroesService;
  let monstersServiceMock: MonstersService;
  let playerDummy: Player;

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

    test('bidParticipationRequest is EventEmitter but has not emitted yet', () => {
      jest.spyOn(uiMediator.bidParticipationRequest, 'emit');
      
      expect(uiMediator.bidParticipationRequest).toBeInstanceOf(EventEmitter);
      expect(uiMediator.bidParticipationRequest.emit).not.toHaveBeenCalled();
    });

    test('heroChoiceRequest is EventEmitter but has not emitted yet', () => {
      jest.spyOn(uiMediator.heroChoiceRequest, 'emit');
      
      expect(uiMediator.heroChoiceRequest).toBeInstanceOf(EventEmitter);
      expect(uiMediator.heroChoiceRequest.emit).not.toHaveBeenCalled();
    });
    
    test('playersRequest is EventEmitter but has not emitted yet', () => {
      jest.spyOn(uiMediator.playersRequest, 'emit');
      
      expect(uiMediator.playersRequest).toBeInstanceOf(EventEmitter);
      expect(uiMediator.playersRequest.emit).not.toHaveBeenCalled();
    });
  });

  describe('notifyBiddingResult', () => {
    let raiderDummy: Player;
    let endReasonDummy: BiddingEndReason;
    let subscription: Subscription;

    beforeEach(() => {
      raiderDummy = PlayerDouble.createDouble();
      endReasonDummy = 'last-bidding-player';

      subscription = uiMediator.biddingEndNotification
        .subscribe(notification => {
          notification.resolve(true);
        });
    });

    test('it emits notification with expected properties', async () => {
      jest.spyOn(uiMediator.biddingEndNotification, 'emit');
      
      expect.assertions(2);

      await uiMediator.notifyBiddingResult(raiderDummy, endReasonDummy);

      expect(uiMediator.biddingEndNotification.emit)
        .toHaveBeenCalledTimes(1);
      expect(uiMediator.biddingEndNotification.emit)
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
      const unResolved = uiMediator
        .notifyBiddingResult(raiderDummy, endReasonDummy);

      expect(unResolved).not.toResolve();

      const resolved = uiMediator
        .notifyBiddingResult(raiderDummy, endReasonDummy);
      uiMediator.biddingEndNotification.subscribe(notification => {
        notification.resolve(true);
      });

      expect(resolved).toResolve();
    });
  });

  describe('notifyForcibleMonsterAddition', () => {
    let playerDummy: Player;
    let monsterDummy: MonsterType;
    let subscription: Subscription;

    beforeEach(() => {
      playerDummy = PlayerDouble.createDouble();
      monsterDummy = pickRandomMonsterTypes(1)[0];
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

      jest.spyOn(uiMediator.forcibleMonsterAdditionNotification, 'emit');
      jest.spyOn(monstersServiceMock, 'getViewDataFor')
        .mockReturnValue(monsterViewDataDummy);
      
      expect.assertions(2);

      await uiMediator.notifyForcibleMonsterAddition(playerDummy, monsterDummy);

      expect(uiMediator.forcibleMonsterAdditionNotification.emit)
        .toHaveBeenCalledTimes(1);
      expect(uiMediator.forcibleMonsterAdditionNotification.emit)
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
      const unResolved = uiMediator
        .notifyForcibleMonsterAddition(playerDummy, monsterDummy);

      expect(unResolved).not.toResolve();

      const resolved = uiMediator
        .notifyForcibleMonsterAddition(playerDummy, monsterDummy);
      uiMediator.forcibleMonsterAdditionNotification.subscribe(notification => {
        notification.resolve(true);
      });

      expect(resolved).toResolve();
    });
  });

  describe.each([
    true, false
  ])('requestBidParticipation (accepted: %s)', acceptedDummy => {
    let stateDummy: BiddingActionRequestData['state'];

    beforeEach(() => {
      stateDummy = buildRequestStateDummy();

      fakeBidParticipationDecision(acceptedDummy, uiMediator);
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

        jest.spyOn(uiMediator.bidParticipationRequest, 'emit');
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

        expect(uiMediator.bidParticipationRequest.emit).toHaveBeenCalledTimes(1);
        expect(uiMediator.bidParticipationRequest.emit)
          .toHaveBeenCalledWith(expect.objectContaining({
            content: expect.objectContaining({
              player: playerDummy.name,
              state: expectedState,
            }),
            resolve: expect.toBeFunction()
          }));
      }
    );

    test('it returns response to request', async () => {
      expect.assertions(1);

      const response 
        = await uiMediator.requestBidParticipation(playerDummy, stateDummy);

      expect(response).toBe(acceptedDummy);
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

      fakeHeroChoice(chosenHeroDummy, uiMediator);
      jest.spyOn(heroesServiceMock, 'getHeroOptions')
        .mockReturnValue(heroOptionsDummy);
    });

    test('it asks HeroesService for Hero options', async () => {
      expect.assertions(1);

      await uiMediator.requestHeroChoice(playerDummy);

      expect(heroesServiceMock.getHeroOptions).toHaveBeenCalled();
    });

    test('it emits HeroChoiceRequest with expected properties', async () => {      
      jest.spyOn(uiMediator.heroChoiceRequest, 'emit');

      expect.assertions(2);

      await uiMediator.requestHeroChoice(playerDummy);

      expect(uiMediator.heroChoiceRequest.emit).toHaveBeenCalledTimes(1);
      expect(uiMediator.heroChoiceRequest.emit)
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
      fakePlayerAddition(addedPlayersDummy, uiMediator);
    });

    test('it emits PlayersRequest with expected properties', async () => {      
      jest.spyOn(uiMediator.playersRequest, 'emit');

      expect.assertions(2);

      await uiMediator.requestPlayers(rangeDummy);

      expect(uiMediator.playersRequest.emit).toHaveBeenCalledTimes(1);
      expect(uiMediator.playersRequest.emit)
        .toHaveBeenCalledWith(expect.objectContaining({
          content: expect.objectContaining({
            range: [rangeDummy.min, rangeDummy.max],
          }),
          resolve: expect.toBeFunction()
        }));
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
