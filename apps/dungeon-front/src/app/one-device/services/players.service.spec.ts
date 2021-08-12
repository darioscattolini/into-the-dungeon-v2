import { TestBed } from '@angular/core/testing';
import { randomString } from '@into-the-dungeon/util-testing';

import { PlayersService } from './players.service';
import { UiMediatorService } from './ui-mediator.service';
import { Player } from '../../models/models';
import { buildPlayerRequirementsDummy } from '../../models/test-doubles';

jest.mock('./ui-mediator.service');

describe('PlayersService', () => {
  let playersService: PlayersService;
  let uiMediator: UiMediatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlayersService,
        UiMediatorService
      ]
    });
    playersService = TestBed.inject(PlayersService);
    uiMediator = TestBed.inject(UiMediatorService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(playersService).toBeTruthy();
  });

  describe('getJoiningPlayers', () => {
    const requirementsDummy = buildPlayerRequirementsDummy();

    describe('player amount validation', () => {
      test('it throws error if uiMed.getPlAmount is below range', async () => {
        jest.spyOn(uiMediator, 'requestPlayersAmount')
          .mockResolvedValue(requirementsDummy.min - 1);
          
        expect.assertions(1);
  
        await expect(playersService.getJoiningPlayers(requirementsDummy))
          .rejects.toThrow('Amount of players out of expected range');
      });
  
      test('it throws error if uiMed.getPlAmount is above range', async () => {
        jest.spyOn(uiMediator, 'requestPlayersAmount')
          .mockResolvedValue(requirementsDummy.max + 1);
          
        expect.assertions(1);
  
        await expect(playersService.getJoiningPlayers(requirementsDummy))
          .rejects.toThrow('Amount of players out of expected range');
      });
    });

    describe('name uniqueness validation', () => {
      const wrongAttempts = 2;
      const rightAttempts = 2;
      const totalAttempts = wrongAttempts + rightAttempts;
      const name1Dummy = randomString(5);
      const name2Dummy = randomString(6);

      beforeEach(() => {
        jest.spyOn(uiMediator, 'requestPlayersAmount')
          .mockResolvedValue(rightAttempts);
  
        let nameProviderMock = jest.spyOn(uiMediator, 'requestPlayerName')
          .mockResolvedValue(name2Dummy)
          .mockResolvedValueOnce(name1Dummy);
        
        for (let i = 0; i < wrongAttempts; i++) {
          nameProviderMock = nameProviderMock.mockResolvedValueOnce(name1Dummy);
        }
      });

      test('it notifies repetition error until new name', async () => {
        const message = `There can only be one player named ${name1Dummy}`;
        
        expect.assertions(3);
  
        await playersService
          .getJoiningPlayers({ min: rightAttempts, max: rightAttempts });
  
        expect(uiMediator.notifyError).toHaveBeenCalledTimes(wrongAttempts);
        expect(uiMediator.notifyError).toHaveBeenNthCalledWith(1, message);
        expect(uiMediator.notifyError).toHaveBeenNthCalledWith(2, message);
      });

      test('it requests new player name until no error', async () => {
        expect.assertions(1);
  
        await playersService
          .getJoiningPlayers({ min: rightAttempts, max: rightAttempts });
  
        expect(uiMediator.requestPlayerName).toHaveBeenCalledTimes(totalAttempts);
      });

      test('it returns Players with unique names', async () => {
        expect.assertions(2);
  
        const players = await playersService
          .getJoiningPlayers({ min: rightAttempts, max: rightAttempts });

        const names = players.map(player => player.name);

        expect(players).toBeArrayOfSize(rightAttempts);
        expect(names).toHaveNoRepeatedMembers();
      });
    });

    describe('valid behaviour', () => {
      /* Sets up parameter for test.each*/
      const minPlayers = requirementsDummy.min;
      const maxPlayers = requirementsDummy.max;
      const allowedPlayersRange: number[] = [];
      
      for (let i = minPlayers; i <= maxPlayers; i++) {
        allowedPlayersRange.push(i);
      }
      
      const names: string[] = [];  
      
      for (let i = 0; i < maxPlayers; i++) names.push(randomString(i+2));

      let nameProviderMock: jest.SpyInstance<Promise<string>>;
      
      beforeEach(() => {       
        nameProviderMock = jest.spyOn(uiMediator, 'requestPlayerName');

        for (const name of names) {
          nameProviderMock = nameProviderMock.mockResolvedValueOnce(name);
        }
      });

      test.each(allowedPlayersRange)(
        'it returns array of Players', 
        async (playersAmount: number) => {
          jest.spyOn(uiMediator, 'requestPlayersAmount')
            .mockResolvedValue(playersAmount);

          expect.assertions(1);

          const players = await playersService.getJoiningPlayers(requirementsDummy);

          expect(players).toSatisfyAll(player => player instanceof Player);
        }
      );

      test.each(allowedPlayersRange)(
        'it returns array with the expected amount of players', 
        async (playersAmount: number) => {
          jest.spyOn(uiMediator, 'requestPlayersAmount')
            .mockResolvedValue(playersAmount);

          expect.assertions(1);

          const players = await playersService.getJoiningPlayers(requirementsDummy);

          expect(players).toBeArrayOfSize(playersAmount);
        }
      );

      test.each(allowedPlayersRange)(
        'it returns array of Players with provided names', 
        async (playersAmount: number) => {
          jest.spyOn(uiMediator, 'requestPlayersAmount')
            .mockResolvedValue(playersAmount);

          const expectedNames = names.slice(0, playersAmount);

          expect.assertions(1);

          const players = await playersService.getJoiningPlayers(requirementsDummy);
          const returnedNames = players.map(player => player.name);

          expect(returnedNames).toIncludeSameMembers(expectedNames);
        }
      );
    });
  });
});
