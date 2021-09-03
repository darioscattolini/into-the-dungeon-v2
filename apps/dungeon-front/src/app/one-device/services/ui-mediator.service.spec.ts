import { TestBed } from '@angular/core/testing';
import { randomInteger, randomString } from '@into-the-dungeon/util-testing';

import { UiMediatorService } from './ui-mediator.service';
import { HeroesService } from './heroes.service';
import { 
  Player, PlayerRequirements, PlayersRequest, 
  HeroType, AnyHeroViewData, heroTypes, heroViewDataMap,
  EquipmentName, WeaponName, AnyEquipmentViewData, equipmentViewDataMap, 
} from '../../models/models';
import { 
  PlayerDouble, HeroDouble, pickRandomMonsterTypes, pickRandomEquipmentNames 
} from '../../models/test-doubles';
import { EventEmitter } from '@angular/core';

jest.mock('./heroes.service');

function buildHeroOptionsDummy(): AnyHeroViewData[] {
  return heroTypes.reduce(
    (options, type) => {
      const partialData = heroViewDataMap[type];
      const equipment = pickRandomEquipmentNames(6).reduce(
        (pieces, pieceName) => {
          pieces.push(equipmentViewDataMap[pieceName])
          return pieces;
        }, 
        [] as AnyEquipmentViewData[]
      );

      options.push({ ...partialData, equipment });
      
      return options;
    }, 
    [] as AnyHeroViewData[]
  );
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
  let playerDummy: Player;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UiMediatorService,
        HeroesService
      ]
    });
    uiMediator = TestBed.inject(UiMediatorService);
    heroesServiceMock = TestBed.inject(HeroesService);

    playerDummy = PlayerDouble.createDouble();
  });

  describe('instantiation and initial state', () => {
    test('it is created', () => {
      expect(uiMediator).toBeTruthy();
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

  describe('notifyError', () => {
    //
  });

  describe('requestBidParticipation', () => {
    test('it returns a boolean', async () => {
      expect.assertions(1);

      const response = await uiMediator.requestBidParticipation(playerDummy);

      expect(response).toBeBoolean();
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
