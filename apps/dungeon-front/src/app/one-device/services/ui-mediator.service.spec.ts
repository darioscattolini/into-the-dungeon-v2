import { TestBed } from '@angular/core/testing';
import { randomInteger, randomString } from '@into-the-dungeon/util-testing';

import { EquipmentService } from './equipment.service';
import { UiMediatorService } from './ui-mediator.service';
import { HeroesService } from './heroes.service';
import { MonstersService } from './monsters.service';
import {
  AnyHeroViewData,
  BiddingActionRequestData,
  BiddingEndReason,
  BiddingStateViewData,
  Encounter,
  EncounterOutcome,
  EncounterResolutionRequest,
  EquipmentName,
  HeroType,
  MonsterType,
  monsterTypes,
  MonsterViewData,
  Player,
  PlayerRequirements,
  PlayingHeroViewData,
  RaidState,
  RoundResult,
  WeaponName
} from '../../models/models';
import {
  buildRequestStateDataDummy,
  EquipmentDouble,
  HeroDouble,
  MonsterDouble,
  PlayerDouble,
  WeaponDouble
} from '../../models/test-doubles';
import { Subject, Subscription } from 'rxjs';

jest.mock('./equipment.service');
jest.mock('./heroes.service');
jest.mock('./monsters.service');

describe('UiMediatorService', () => {
  let uiMediator: UiMediatorService;
  let equipmentServiceMock: EquipmentService;
  let heroesServiceMock: HeroesService;
  let monstersServiceMock: MonstersService;
  let playerDummy: Player;
  let subscription: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UiMediatorService,
        EquipmentService,
        HeroesService,
        MonstersService
      ]
    });
    uiMediator = TestBed.inject(UiMediatorService);
    equipmentServiceMock = TestBed.inject(EquipmentService);
    heroesServiceMock = TestBed.inject(HeroesService);
    monstersServiceMock = TestBed.inject(MonstersService);

    playerDummy = PlayerDouble.createDouble();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

    test('equipmentRemovalRequest is a Subject but has not emitted yet', () => {
      jest.spyOn(uiMediator.equipmentRemovalRequest, 'next');
      
      expect(uiMediator.equipmentRemovalRequest).toBeInstanceOf(Subject);
      expect(uiMediator.equipmentRemovalRequest.next).not.toHaveBeenCalled();
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

    test('monsterAdditionRequest is a Subject but has not emitted yet', () => {
      jest.spyOn(uiMediator.monsterAdditionRequest, 'next');
      
      expect(uiMediator.monsterAdditionRequest).toBeInstanceOf(Subject);
      expect(uiMediator.monsterAdditionRequest.next).not.toHaveBeenCalled();
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

  describe('notifyEncounterOutcome', () => {
    let raiderDummy: Player;
    let outcomeDummy: EncounterOutcome;

    beforeEach(() => {
      raiderDummy = PlayerDouble.createDouble();
      outcomeDummy = {
        hitPoints: {
          total: randomInteger(6),
          change: -randomInteger(4)
        },
        discardedWeapon: WeaponDouble.pickNames(1)[0]
      };

      // fake reception confirmation
      subscription = uiMediator.encounterOutcomeNotification
        .subscribe(notification => {
          notification.resolve(true);
        });
    });

    test('it emits notification with expected properties', async () => {
      jest.spyOn(uiMediator.encounterOutcomeNotification, 'next');
      
      expect.assertions(2);

      await uiMediator.notifyEncounterOutcome(raiderDummy, outcomeDummy);

      expect(uiMediator.encounterOutcomeNotification.next)
        .toHaveBeenCalledTimes(1);
      expect(uiMediator.encounterOutcomeNotification.next)
        .toHaveBeenCalledWith(expect.objectContaining({
          content: expect.objectContaining({
            player: raiderDummy.name,
            hitPoints: outcomeDummy.hitPoints,
            discardedWeapon: outcomeDummy.discardedWeapon
          }),
          resolve: expect.toBeFunction()
        }));
    });

    test('notification.resolve makes method resolve', () => {
      subscription.unsubscribe();
      const returnedPromise = uiMediator
        .notifyEncounterOutcome(raiderDummy, outcomeDummy);

      expect(returnedPromise).not.toResolve();

      uiMediator.encounterOutcomeNotification.subscribe(notification => {
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
      [monsterDummy] = MonsterDouble.pickTypes(1);

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

  describe('notifyRoundResult', () => {
    let resultDummy: RoundResult;

    beforeEach(() => {
      resultDummy = {
        points: [],
        winner: PlayerDouble.createDouble()
      };

      // fake reception confirmation
      subscription = uiMediator.roundResultNotification
        .subscribe(notification => {
          notification.resolve(true);
        });
    });

    test('it emits notification with expected properties', async () => {
      jest.spyOn(uiMediator.roundResultNotification, 'next');
      
      expect.assertions(2);

      await uiMediator.notifyRoundResult(resultDummy);

      expect(uiMediator.roundResultNotification.next)
        .toHaveBeenCalledTimes(1);
      expect(uiMediator.roundResultNotification.next)
        .toHaveBeenCalledWith(expect.objectContaining({
          content: resultDummy,
          resolve: expect.toBeFunction()
        }));
    });

    test('notification.resolve makes method resolve', () => {
      subscription.unsubscribe();
      const returnedPromise = uiMediator.notifyRoundResult(resultDummy);

      expect(returnedPromise).not.toResolve();

      uiMediator.roundResultNotification.subscribe(notification => {
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
      stateDummy = buildRequestStateDataDummy();

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

        // works because there are no other calls to getMonsterView
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

      uiMediator.bidParticipationRequest.subscribe(request => {
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

  describe('requestEncounterResolution', () => {
    let raiderDummy: Player;
    let encounterDummy: Encounter;
    let stateDummy: RaidState;
    let chosenEquipmentDummy: WeaponName;

    beforeEach(() => {
      raiderDummy = playerDummy;
      encounterDummy = {
        enemy: MonsterDouble.pickTypes(1)[0],
        weapons: WeaponDouble.pickNames(4)
      };
      stateDummy = {
        hero: HeroDouble.createDouble(),
        remainingEnemies: randomInteger(5)
      };
      [chosenEquipmentDummy] = WeaponDouble.pickNames(1);

      // fake equipment choice
      subscription = uiMediator.encounterResolutionRequest.subscribe(request => {
        request.resolve(chosenEquipmentDummy);
      });
    });
    
    test('it asks MonstersService for enemy view data', async () => {   
      expect.assertions(2);

      await uiMediator
        .requestEncounterResolution(raiderDummy, encounterDummy, stateDummy);

      expect(monstersServiceMock.getViewDataFor).toHaveBeenCalledTimes(1);
      expect(monstersServiceMock.getViewDataFor)
        .toHaveBeenCalledWith(encounterDummy.enemy);
    });

    test('it asks EquipmentService for weapons view data', async () => {   

      expect.assertions(1 + encounterDummy.weapons.length);

      await uiMediator
        .requestEncounterResolution(raiderDummy, encounterDummy, stateDummy);

      expect(equipmentServiceMock.getViewDataFor)
        .toHaveBeenCalledTimes(encounterDummy.weapons.length);
      encounterDummy.weapons.forEach((weapon, index) => {
        expect(equipmentServiceMock.getViewDataFor)
          .toHaveBeenNthCalledWith(index + 1, weapon);
      });
    });

    test('it asks HeroesService for hero view data', async () => {   
      expect.assertions(2);

      await uiMediator
        .requestEncounterResolution(raiderDummy, encounterDummy, stateDummy);

      expect(heroesServiceMock.getPlayingHeroViewData).toHaveBeenCalledTimes(1);
      expect(heroesServiceMock.getPlayingHeroViewData)
        .toHaveBeenCalledWith(stateDummy.hero);
    });

    test(
      'it emits EncounterResolutionRequest with expected properties', 
      async () => {
        const heroViewDataDummy = HeroDouble.createPlayingHeroViewDataDouble();
        const monsterViewDataDummy = MonsterDouble.createViewDataDouble();

        jest.spyOn(uiMediator.encounterResolutionRequest, 'next');
        jest.spyOn(heroesServiceMock, 'getPlayingHeroViewData')
          .mockReturnValue(heroViewDataDummy);
        jest.spyOn(monstersServiceMock, 'getViewDataFor')
          .mockReturnValue(monsterViewDataDummy);
        const getEquipmentViewDataSpy = jest
          .spyOn(equipmentServiceMock, 'getViewDataFor')
          .mockImplementation(() => WeaponDouble.buildViewDataDummy());

        expect.assertions(2);

        await uiMediator
          .requestEncounterResolution(raiderDummy, encounterDummy, stateDummy);

        // works because there are no other calls to getEquipmentView
        const weaponsViewDataDummy = getEquipmentViewDataSpy.mock.results
          .map(result => result.value);

        const expectedEncounter: 
          EncounterResolutionRequest['content']['encounter'] = {
            enemy: monsterViewDataDummy,
            weapons: weaponsViewDataDummy
          };
        
        const expectedState: EncounterResolutionRequest['content']['state'] = {
          hero: heroViewDataDummy,
          remainingEnemies: stateDummy.remainingEnemies
        };
        
        expect(uiMediator.encounterResolutionRequest.next)
          .toHaveBeenCalledTimes(1);
        expect(uiMediator.encounterResolutionRequest.next)
          .toHaveBeenCalledWith(expect.objectContaining({
            content: expect.objectContaining({
              player: raiderDummy.name,
              encounter: expectedEncounter,
              state: expectedState
            }),
            resolve: expect.toBeFunction()
          }));
      }
    );

    test('request.resolve makes method resolve', () => {
      subscription.unsubscribe();
      const returnedPromise = uiMediator
        .requestEncounterResolution(raiderDummy, encounterDummy, stateDummy);

      expect(returnedPromise).not.toResolve();

      uiMediator.encounterResolutionRequest.subscribe(request => {
        request.resolve(chosenEquipmentDummy);
      });

      expect(returnedPromise).toResolve();
    });

    test('it returns response to request', async () => {
      expect.assertions(1);

      const response = await uiMediator
        .requestEncounterResolution(raiderDummy, encounterDummy, stateDummy);

      expect(response).toBe(chosenEquipmentDummy);
    });
  });

  describe('requestEquipmentRemoval', () => {
    let stateDummy: BiddingActionRequestData['state'];
    let chosenPiece: EquipmentName;
    let heroViewDataDummy: PlayingHeroViewData;  

    beforeEach(() => {
      stateDummy = buildRequestStateDataDummy();
      [chosenPiece] = EquipmentDouble.pickNames(1);
      heroViewDataDummy = HeroDouble.createPlayingHeroViewDataDouble();
      
      jest.spyOn(heroesServiceMock, 'getPlayingHeroViewData')
          .mockReturnValue(heroViewDataDummy);

      // fake equipment choice
      subscription = uiMediator.equipmentRemovalRequest.subscribe(request => {
        request.resolve(chosenPiece);
      });
    });

    test('it asks HeroesService for Hero view data', async () => {
      expect.assertions(2);

      await uiMediator.requestEquipmentRemoval(playerDummy, stateDummy);

      expect(heroesServiceMock.getPlayingHeroViewData).toHaveBeenCalledTimes(1);
      expect(heroesServiceMock.getPlayingHeroViewData)
        .toHaveBeenCalledWith(stateDummy.hero);
    });

    test('it asks MonsterService for Monster view data', async () => {   
      expect.assertions(1 + stateDummy.dungeon.length);

      await uiMediator.requestEquipmentRemoval(playerDummy, stateDummy);

      expect(monstersServiceMock.getViewDataFor)
        .toHaveBeenCalledTimes(stateDummy.dungeon.length);
      stateDummy.dungeon.forEach((monster, index) => {
        expect(monstersServiceMock.getViewDataFor)
          .toHaveBeenNthCalledWith(index + 1, monster);
      });
    });

    test('it emits EquipmentRemovalRequest with expected properties', async () => {
      jest.spyOn(uiMediator.equipmentRemovalRequest, 'next');
      
      const getMonsterViewDataSpy = jest
        .spyOn(monstersServiceMock, 'getViewDataFor')
        .mockImplementation(() => MonsterDouble.createViewDataDouble());

      expect.assertions(2);

      await uiMediator.requestEquipmentRemoval(playerDummy, stateDummy);

      // works because there are no other calls to getMonsterView
      const dungeonViewDataDummy = getMonsterViewDataSpy.mock.results
        .map(result => result.value);

      const expectedState: BiddingStateViewData = {
        dungeon: dungeonViewDataDummy,
        hero: heroViewDataDummy,
        remainingMonsters: stateDummy.remainingMonsters,
        remainingPlayers: stateDummy.remainingPlayers
      };

      expect(uiMediator.equipmentRemovalRequest.next).toHaveBeenCalledTimes(1);
      expect(uiMediator.equipmentRemovalRequest.next)
        .toHaveBeenCalledWith(expect.objectContaining({
          content: expect.objectContaining({
            player: playerDummy.name,
            state: expectedState,
          }),
          resolve: expect.toBeFunction()
        }));
    });

    test('request.resolve makes method resolve', () => {
      subscription.unsubscribe();
      const returnedPromise = uiMediator
        .requestEquipmentRemoval(playerDummy, stateDummy);

      expect(returnedPromise).not.toResolve();

      uiMediator.equipmentRemovalRequest.subscribe(request => {
        request.resolve(chosenPiece);
      });

      expect(returnedPromise).toResolve();
    });

    test('it returns response to request', async () => {
      expect.assertions(1);

      const response 
        = await uiMediator.requestEquipmentRemoval(playerDummy, stateDummy);

      expect(response).toBe(chosenPiece);
    });
  });

  describe('requestHeroChoice', () => {
    let chosenHeroDummy: HeroType;
    let heroOptionsDummy: AnyHeroViewData[];

    beforeEach(() => {
      chosenHeroDummy = HeroDouble.pickType();
      heroOptionsDummy = [
        HeroDouble.createStartingHeroViewDataDouble(),
        HeroDouble.createStartingHeroViewDataDouble(),
        HeroDouble.createStartingHeroViewDataDouble()
      ];

      // fake hero choice
      subscription = uiMediator.heroChoiceRequest.subscribe(request => {
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

  describe.each([
    true, false
  ])('requestMonsterAddition (accepted: %s)', decisionDummy => {
    let playerDummy: Player;
    let monsterDummy: MonsterType;
    let stateDummy: BiddingActionRequestData['state'];

    beforeEach(() => {
      playerDummy = PlayerDouble.createDouble();
      [monsterDummy] = MonsterDouble.pickTypes(1);
      stateDummy = buildRequestStateDataDummy();

      // fake monster addition acceptance/rejection
      subscription = uiMediator.monsterAdditionRequest
        .subscribe(notification => {
          notification.resolve(decisionDummy);
        });
    });

    test('it asks monstersService for view data of added monster', async () => {
      expect.assertions(1);

      await uiMediator
        .requestMonsterAddition(playerDummy, monsterDummy, stateDummy);

      expect(monstersServiceMock.getViewDataFor)
        .toHaveBeenCalledWith(monsterDummy);
    });

    test('it emits MonsterAdditionRequest with expected properties', async () => {
      const heroViewDataDummy = HeroDouble.createPlayingHeroViewDataDouble();
      
      // guarantees that the same double is returned for each type
      const monsterViewDataProvider = monsterTypes.reduce((provider, type) => {
        Object.defineProperty(provider, type, { 
          value: MonsterDouble.createViewDataDouble() 
        });

        return provider;
      }, {} as Record<MonsterType | 'secret', MonsterViewData<MonsterType>>);
      
      jest.spyOn(uiMediator.monsterAdditionRequest, 'next');
      jest.spyOn(heroesServiceMock, 'getPlayingHeroViewData')
        .mockReturnValue(heroViewDataDummy);
      jest.spyOn(monstersServiceMock, 'getViewDataFor')
        .mockImplementation(type => {
          return monsterViewDataProvider[type];
        });
      
      expect.assertions(2);

      await uiMediator
        .requestMonsterAddition(playerDummy, monsterDummy, stateDummy);

      const dungeonViewDataDummy = stateDummy.dungeon
        .map(monster => monsterViewDataProvider[monster]);
    
      const expectedState: BiddingStateViewData = {
          dungeon: dungeonViewDataDummy,
          hero: heroViewDataDummy,
          remainingMonsters: stateDummy.remainingMonsters,
          remainingPlayers: stateDummy.remainingPlayers
        };

      expect(uiMediator.monsterAdditionRequest.next).toHaveBeenCalledTimes(1);
      expect(uiMediator.monsterAdditionRequest.next)
        .toHaveBeenCalledWith(expect.objectContaining({
          content: expect.objectContaining({
            player: playerDummy.name,
            monster: monsterViewDataProvider[monsterDummy],
            state: expectedState,
          }),
          resolve: expect.toBeFunction()
        }));
    });

    test('request.resolve makes method resolve', () => {
      subscription.unsubscribe();
      const returnedPromise = uiMediator
        .requestMonsterAddition(playerDummy, monsterDummy, stateDummy);

      expect(returnedPromise).not.toResolve();

      uiMediator.monsterAdditionRequest.subscribe(request => {
        request.resolve(true);
      });

      expect(returnedPromise).toResolve();
    });

    test('it returns response to request', async () => {
      expect.assertions(1);

      const response = await uiMediator
        .requestMonsterAddition(playerDummy, monsterDummy, stateDummy);

      expect(response).toBe(decisionDummy);
    });
  });

  describe('requestPlayers', () => {
    let rangeDummy: PlayerRequirements;
    let addedPlayersDummy: string[];

    beforeEach(() => {
      rangeDummy = PlayerDouble.buildRequirementsDouble();
      addedPlayersDummy = [randomString(6), randomString(5), randomString(8)];
      
      // fake players addition
      subscription = uiMediator.playersRequest.subscribe(request => {
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
});
