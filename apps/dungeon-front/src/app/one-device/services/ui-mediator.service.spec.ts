import { TestBed } from '@angular/core/testing';
import { randomInteger } from '@into-the-dungeon/util-testing';

import { UiMediatorService } from './ui-mediator.service';
import { HeroesService } from './heroes.service';
import { 
  Player, HeroType, EquipmentName, WeaponName 
} from '../../models/models';
import { 
  PlayerDouble, HeroDouble, pickRandomMonsterTypes 
} from '../../models/test-doubles';

jest.mock('./heroes.service');

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

  it('should be created', () => {
    expect(uiMediator).toBeTruthy();
  });

  describe('notifyError', () => {
    //
  });

  describe('requestPlayersAmount', () => {
    test('it returns a number', async () => {
      const min = randomInteger(4);
      const max = min + 5;
      const rangeDummy: [number, number] = [min, max];
      
      expect.assertions(1);

      const playersAmount = await uiMediator.requestPlayersAmount(rangeDummy);

      expect(playersAmount).toBeNumber();
    });

    // Test validation on ranges (max after min, two numbers, positive)
    // Test return between range
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
    test('it asks HeroesService for Hero options', async () => {
      expect.assertions(1);

      await uiMediator.requestHeroChoice(playerDummy);

      expect(heroesServiceMock.getHeroOptions).toHaveBeenCalled();
    });

    test('it asks HeroesService to create chosen Hero', async () => {
      const chosenHero: HeroType = 'bard';
      // this value should be provided to player selection stub

      expect.assertions(1);

      await uiMediator.requestHeroChoice(playerDummy);

      expect(heroesServiceMock.createHero).toHaveBeenCalledWith(chosenHero);
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

  describe('requestPlayerName', () => {
    test('it returns a string', async () => {
      expect.assertions(1);

      const name = await uiMediator.requestPlayerName();

      expect(name).toBeString();
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
