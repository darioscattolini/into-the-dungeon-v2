import { TestBed } from '@angular/core/testing';
import { randomInteger, randomString } from '@into-the-dungeon/util-testing';

import { UiMediatorService } from './ui-mediator.service';
import { HeroesService } from './heroes.service';
import { MonstersService } from './monsters.service';
import { 
  Player, PlayerRequirements, 
  ForcibleMonsterAdditionNotificationData, BiddingEndReason,
  BiddingActionRequestData, BidParticipationRequestData, BiddingStateViewData,
  HeroType, AnyHeroViewData, heroTypes, heroViewDataMap, PlayingHeroViewData,
  EquipmentName, WeaponName, MonsterType, MonsterViewData, monsterViewDataMap
} from '../../models/models';
import { 
  PlayerDouble, HeroDouble, pickRandomMonsterTypes, buildEquipmentViewDataDummy
} from '../../models/test-doubles';
import { EventEmitter } from '@angular/core';

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
    request.onResponse(decision);
  });
}

function fakeHeroChoice(chosenOption: HeroType, uiMediator: UiMediatorService) {
  uiMediator.heroChoiceRequest.subscribe(request => {
    request.onResponse(chosenOption);
  });
}

function fakePlayerAddition(names: string[], uiMediator: UiMediatorService) {
  uiMediator.playersRequest.subscribe(request => {
    request.onResponse(names);
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

    beforeEach(() => {
      raiderDummy = PlayerDouble.createDouble();
      endReasonDummy = 'last-bidding-player';

      uiMediator.biddingEndNotification.subscribe(notification => {
        notification.onResponse(true);
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
          player: raiderDummy.name,
          content: endReasonDummy,
          promise: expect.toSatisfy(x => x instanceof Promise),
          onResponse: expect.toBeFunction()
        }));
    });

    test('it awaits notification resolution', () => {
      const resolved = uiMediator
        .notifyBiddingResult(raiderDummy, endReasonDummy);
      
      expect(resolved).toResolve();

      uiMediator.biddingEndNotification.unsubscribe();
      const unResolved = uiMediator
        .notifyBiddingResult(raiderDummy, endReasonDummy);

      expect(unResolved).not.toResolve();
    });
  });

  describe('notifyForcibleMonsterAddition', () => {
    let dataDummy: ForcibleMonsterAdditionNotificationData;

    beforeEach(() => {
      dataDummy = {
        player: PlayerDouble.createDouble(),
        forciblyAddedMonster: pickRandomMonsterTypes(1)[0]
      }

      uiMediator.forcibleMonsterAdditionNotification.subscribe(notification => {
        notification.onResponse(true);
      });
    });

    test('it asks monstersService for view data of added monster', async () => {
      expect.assertions(1);

      await uiMediator.notifyForcibleMonsterAddition(dataDummy);

      expect(monstersServiceMock.getViewDataFor)
        .toHaveBeenCalledWith(dataDummy.forciblyAddedMonster);
    });

    test('it emits notification with expected properties', async () => {
      const monsterViewDataDummy: MonsterViewData<MonsterType> = {
        name: 'orc',
        image: '...',
        damage: randomInteger(5),
        description: randomString(10)
      };

      jest.spyOn(uiMediator.forcibleMonsterAdditionNotification, 'emit');
      jest.spyOn(monstersServiceMock, 'getViewDataFor')
        .mockReturnValue(monsterViewDataDummy);
      
      expect.assertions(2);

      await uiMediator.notifyForcibleMonsterAddition(dataDummy);

      expect(uiMediator.forcibleMonsterAdditionNotification.emit)
        .toHaveBeenCalledTimes(1);
      expect(uiMediator.forcibleMonsterAdditionNotification.emit)
        .toHaveBeenCalledWith(expect.objectContaining({
          player: dataDummy.player.name,
          content: monsterViewDataDummy,
          promise: expect.toSatisfy(x => x instanceof Promise),
          onResponse: expect.toBeFunction()
        }));
    });

    test('it awaits notification resolution', () => {
      const resolved = uiMediator.notifyForcibleMonsterAddition(dataDummy);
      
      expect(resolved).toResolve();

      uiMediator.forcibleMonsterAdditionNotification.unsubscribe();
      const unResolved = uiMediator.notifyForcibleMonsterAddition(dataDummy);

      expect(unResolved).not.toResolve();
    });
  });

  describe.each([
    true, false
  ])('requestBidParticipation (accepted: %s)', acceptedDummy => {
    let requestDataDummy: BidParticipationRequestData;

    beforeEach(() => {
      requestDataDummy = {
        action: 'play-bidding',
        player: playerDummy,
        content: undefined,
        state: buildRequestStateDummy()
      };

      fakeBidParticipationDecision(acceptedDummy, uiMediator);
    });

    test('it asks HeroesService for Hero view data', async () => {
      expect.assertions(2);

      await uiMediator.requestBidParticipation(requestDataDummy);

      expect(heroesServiceMock.getPlayingHeroViewData).toHaveBeenCalledTimes(1);
      expect(heroesServiceMock.getPlayingHeroViewData)
        .toHaveBeenCalledWith(requestDataDummy.state.hero);
    });

    test('it asks MonsterService for Monster view data', async () => {
      const dungeonDummy = requestDataDummy.state.dungeon;
      
      expect.assertions(1 + dungeonDummy.length);

      await uiMediator.requestBidParticipation(requestDataDummy);

      expect(monstersServiceMock.getViewDataFor)
        .toHaveBeenCalledTimes(dungeonDummy.length);
      dungeonDummy.forEach((monster, index) => {
        expect(monstersServiceMock.getViewDataFor)
          .toHaveBeenNthCalledWith(index + 1, monster);
      });
    });

    test(
      'it emits BidParticipationRequest with expected properties', 
      async () => {
        const heroViewDataDummy: PlayingHeroViewData = {
          type: 'bard',
          image: '...',
          hitPoints: 3,
          equipment: buildEquipmentViewDataDummy(),
          description: randomString(10)
        };

        jest.spyOn(uiMediator.bidParticipationRequest, 'emit');
        jest.spyOn(heroesServiceMock, 'getPlayingHeroViewData')
          .mockReturnValue(heroViewDataDummy);
        const getMonsterViewDataSpy = jest
          .spyOn(monstersServiceMock, 'getViewDataFor')
          .mockImplementation(name => monsterViewDataMap[name]);

        expect.assertions(2);

        await uiMediator.requestBidParticipation(requestDataDummy);

        const dungeonViewData = getMonsterViewDataSpy.mock.results
          .map(result => result.value);

        const expectedState: BiddingStateViewData = {
          dungeon: dungeonViewData,
          hero: heroViewDataDummy,
          remainingMonsters: requestDataDummy.state.remainingMonsters,
          remainingPlayers: requestDataDummy.state.remainingPlayers
        };

        expect(uiMediator.bidParticipationRequest.emit).toHaveBeenCalledTimes(1);
        expect(uiMediator.bidParticipationRequest.emit)
          .toHaveBeenCalledWith(expect.objectContaining({
            player: playerDummy.name,
            state: expectedState,
            promise: expect.toSatisfy(x => x instanceof Promise),
            onResponse: expect.toBeFunction()
          }));
      }
    );

    test('it returns response to request', async () => {
      expect.assertions(1);

      const response = await uiMediator.requestBidParticipation(requestDataDummy);

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
          player: playerDummy.name,
          options: expect.arrayContaining(heroOptionsDummy),
          promise: expect.toSatisfy(x => x instanceof Promise),
          onResponse: expect.toBeFunction()
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
          range: [rangeDummy.min, rangeDummy.max],
          promise: expect.toSatisfy(x => x instanceof Promise),
          onResponse: expect.toBeFunction()
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
