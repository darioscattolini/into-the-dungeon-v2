import { TestBed } from '@angular/core/testing';
import { randomInteger } from '@into-the-dungeon/util-testing';

import { UiMediatorService } from './ui-mediator.service';
import { Hero, EquipmentName, WeaponName } from '../../models/models';
import { PlayerDouble, pickRandomMonsterTypes } from '../../models/test-doubles';

describe('UiMediatorService', () => {
  let uiMediator: UiMediatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UiMediatorService
      ]
    });
    uiMediator = TestBed.inject(UiMediatorService);
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
      const playerDummy = PlayerDouble.createDouble();

      expect.assertions(1);

      const response = await uiMediator.requestBidParticipation(playerDummy);

      expect(response).toBeBoolean();
    });
  });

  describe('requestEquipmentRemoval', () => {
    test('it returns a string', async () => {
      const playerDummy = PlayerDouble.createDouble();
      const optionsDummy: EquipmentName[] = [];

      expect.assertions(1);

      const itemName = 
        await uiMediator.requestEquipmentRemoval(playerDummy, optionsDummy);

      expect(itemName).toBeString();
    });
  });

  describe('requestHeroChoice', () => {
    test('it returns a Hero', async () => {
      const playerDummy = PlayerDouble.createDouble();
      
      expect.assertions(1);

      const hero = await uiMediator.requestHeroChoice(playerDummy);

      expect(hero).toBeInstanceOf(Hero);
    });
  });

  describe('requestMonsterAddition', () => {
    test('it returns a boolean', async () => {
      const playerDummy = PlayerDouble.createDouble();
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
      const playerDummy = PlayerDouble.createDouble();
      const optionsDummy: WeaponName[] = [];

      expect.assertions(1);

      const itemName = 
        await uiMediator.requestWeaponChoice(playerDummy, optionsDummy);

      expect(itemName).toBeString();
    });
  });
});
