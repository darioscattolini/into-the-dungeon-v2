import { TestBed } from '@angular/core/testing';
import { mocked } from 'ts-jest/utils';

import { GameService } from './game.service';
import { PlayersService } from './players.service';
import { BiddingService } from './bidding.service';
import { RaidService } from './raid.service';
import { 
  Game, BiddingPlayersRound, RaidParticipants, RaidResult,
  Player, PlayerRequirements
} from '../../models/models';
import { 
  PlayerDouble, BiddingPlayersRoundDouble, 
  HeroDouble, MonsterDouble, buildPlayerRequirementsDummy 
} from '../../models/test-doubles';

jest.mock('./players.service');
jest.mock('./bidding.service');
jest.mock('./raid.service');

jest.mock('../../models/game-mechanics/game.ts');
const GameMock = mocked(Game, true);

describe('GameService', () => {
  let gameService: GameService;
  let biddingService: BiddingService;
  let raidService: RaidService;
  let playersService: PlayersService;

  const roundLoopController = jest.spyOn(GameMock.prototype, 'getWinner');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GameService, 
        PlayersService, 
        BiddingService, 
        RaidService
      ]
    });
    gameService = TestBed.inject(GameService);
    biddingService = TestBed.inject(BiddingService);
    raidService = TestBed.inject(RaidService);
    playersService = TestBed.inject(PlayersService);

    // set up return value making round loop end (runs once by default)
    roundLoopController.mockReturnValue(PlayerDouble.createDouble());
  });

  afterEach(() => {
    jest.restoreAllMocks();
    GameMock.mockRestore();
  });
  
  test('it is created', () => {
    expect(gameService).toBeTruthy();
  });

  describe('game creation', () => {
    let requirementsDummy: PlayerRequirements;
    let playersDummy: Player[];

    beforeEach(() => {
      requirementsDummy = buildPlayerRequirementsDummy();
  
      playersDummy = [PlayerDouble.createDouble(), PlayerDouble.createDouble()];
  
      jest.spyOn(Game, 'getPlayerRequirements')
        .mockReturnValue(requirementsDummy);
      
      jest.spyOn(playersService, 'getJoiningPlayers')
        .mockResolvedValue(playersDummy);
    });

    test('it asks Game class for player requirements', async () => {
      expect.assertions(1);
  
      await gameService.play();
  
      expect(Game.getPlayerRequirements).toHaveBeenCalled();
    });
  
    test(
      'it asks PlayersService for players with Game requirements', 
      async () => {
        expect.assertions(1);
    
        await gameService.play();
    
        expect(playersService.getJoiningPlayers)
          .toHaveBeenCalledWith(requirementsDummy);
      }
    );
  
    test('it creates Game with players from PlayersService', async () => {
      expect.assertions(1);
  
      await gameService.play();
  
      expect(Game).toHaveBeenCalledWith(playersDummy);
    });
  });

  describe.each([1, 2, 3, 4])('round iteration', loopRuns => {

    beforeEach(() => {
      // make round loop run loopRuns times
      for (let i = 0; i < loopRuns - 1; i++) {
        roundLoopController.mockReturnValueOnce(undefined);
      }
    });

    test(`it runs ${loopRuns} times until Game.goesOn is false`, async () => {
      expect.assertions(3);

      await gameService.play();

      const [gameMock] = GameMock.mock.instances;

      expect(biddingService.playBidding).toHaveBeenCalledTimes(loopRuns);
      expect(raidService.playRaid).toHaveBeenCalledTimes(loopRuns);
      expect(gameMock.getWinner).toHaveBeenCalledTimes(loopRuns);
    });
  });

  describe('round execution', () => {
    let biddingPlayersDummy1: BiddingPlayersRound;
    let biddingPlayersDummy2: BiddingPlayersRound;
    let biddingResultDummy1: RaidParticipants;
    let biddingResultDummy2: RaidParticipants;
    let raidResultDummy1: RaidResult;
    let raidResultDummy2: RaidResult;

    beforeEach(() => {
      biddingPlayersDummy1 = BiddingPlayersRoundDouble.createDouble();
      biddingPlayersDummy2 = BiddingPlayersRoundDouble.createDouble();
      
      biddingResultDummy1 = {
        raider: PlayerDouble.createDouble(),
        hero: HeroDouble.createDouble(),
        enemies: [MonsterDouble.createDouble(), MonsterDouble.createDouble()]
      };
      biddingResultDummy2 = {
        raider: PlayerDouble.createDouble(),
        hero: HeroDouble.createDouble(),
        enemies: [MonsterDouble.createDouble(), MonsterDouble.createDouble()]
      };
      
      raidResultDummy1 = {
        raider: PlayerDouble.createDouble(),
        survived: true
      };
      raidResultDummy2 = {
        raider: PlayerDouble.createDouble(),
        survived: false
      };

      // make round loop run twice
      roundLoopController.mockReturnValueOnce(undefined);

      jest.spyOn(Game.prototype, 'getBiddingPlayersRound')
        .mockReturnValueOnce(biddingPlayersDummy1)
        .mockReturnValueOnce(biddingPlayersDummy2);
    
      jest.spyOn(biddingService, 'playBidding')
        .mockResolvedValueOnce(biddingResultDummy1)
        .mockResolvedValueOnce(biddingResultDummy2);
      
      jest.spyOn(raidService, 'playRaid')
        .mockResolvedValueOnce(raidResultDummy1)
        .mockResolvedValueOnce(raidResultDummy2);
    });

    test('bidding is called with starting values provided by Game', async () => {
      expect.assertions(2);

      await gameService.play();

      expect(biddingService.playBidding)
        .toHaveBeenNthCalledWith(1, biddingPlayersDummy1);

      expect(biddingService.playBidding)
        .toHaveBeenNthCalledWith(2, biddingPlayersDummy2);
    });

    test('raid is called with values returned from bidding', async () => {
      expect.assertions(2);

      await gameService.play();

      expect(raidService.playRaid)
        .toHaveBeenNthCalledWith(1, biddingResultDummy1);
      
      expect(raidService.playRaid)
        .toHaveBeenNthCalledWith(2, biddingResultDummy2);
    });

    test('game.endRound is called with values returned from raid', async () => {
      expect.assertions(2);

      await gameService.play();

      const game = GameMock.mock.instances[0];

      expect(game.endRound).toHaveBeenNthCalledWith(1, raidResultDummy1);
      expect(game.endRound).toHaveBeenNthCalledWith(2, raidResultDummy2);
    });
  });

  describe('end of game handling', () => {
    let winner: Player;
    
    beforeEach(() => {
      winner = PlayerDouble.createDouble();
    });

    test('if notification is send with game.winner', async () => {
      //
    });
  });
});
