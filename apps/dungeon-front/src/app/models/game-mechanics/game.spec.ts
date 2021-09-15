import { mocked } from 'ts-jest/utils';

import { Game } from './game';
import { Player, RaidResult, BiddingPlayersRound } from '../models';
import { BiddingPlayersRoundDouble, PlayerDouble } from '../test-doubles';
import { RoundResult } from './round-result';

jest.mock('./bidding/bidding-players-round');
const BiddingPlayersRoundMock = mocked(BiddingPlayersRound);

function addRaidResult(game: Game, raider: Player, survived: boolean) {
  const raidResult: RaidResult = { raider, survived };
  return game.endRound(raidResult);
}

function buildPlayersDummy(amount: number): Player[] {
  const players = [];

  for (let i = 0; i < amount; i++) {
    players.push(PlayerDouble.createDouble());
  }

  return players;
}

describe('Game', () => {
  const minAmount = 2;
  const maxAmount = 4;
  const rightAmounts = [2, 3, 4] as const;
  const wrongAmounts = (() => {
    const wrongAmounts: number[] = [];

    for (let i = 0; i <= 20; i++) {
      if (i < minAmount || i > maxAmount) wrongAmounts.push(i);
    }

    return wrongAmounts;
  })();

  let playerDummy1: Player;
  let playerDummy2: Player;
  let playerDummy3: Player;
  let playersDummy: Player[];
  let game: Game;
    
  beforeEach(() => {
    playersDummy = buildPlayersDummy(3);
    [playerDummy1, playerDummy2, playerDummy3] = playersDummy;
    game = new Game(playersDummy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    BiddingPlayersRoundMock.mockRestore();
  });

  test('Game.getPlayerRequirements returns correct requirements', () => {
    const requirements = Game.getPlayerRequirements();
    
    expect(requirements.min).toBe(2);
    expect(requirements.max).toBe(4);
  });

  describe('instantiation', () => {
    test.each(rightAmounts)('it can be created with %i players', amount => {
      const playersDummy = buildPlayersDummy(amount);
  
      const game = new Game(playersDummy);
  
      expect(game).toBeTruthy();
    });
  
    test.each(wrongAmounts)('it throws error if created with %i players', amount => {
      const playersDummy = buildPlayersDummy(amount);
  
      expect(() => { new Game(playersDummy); })
        .toThrowError('Game must be created with 2-4 players');
    });  
  });

  describe('getBiddingPlayersRound as affected by endRound', () => {
    test('BiddingPlayersRound players with no inactive players yet', () => {
      game.getBiddingPlayersRound();

      // BiddingPlayersRound created with Game parameter members in the same order
      expect(BiddingPlayersRound)
        .toHaveBeenCalledWith(
          [playerDummy1, playerDummy2, playerDummy3],
          expect.toBeNumber()
        );
    });

    test('BiddingPlayersRound players with first player inactive', () => {
      //inactivate player1
      addRaidResult(game, playerDummy1, false);
      addRaidResult(game, playerDummy1, false);

      game.getBiddingPlayersRound();

      //BiddingPlayersRound created with Game parameter members but player1 in the same order
      expect(BiddingPlayersRound)
        .toHaveBeenCalledWith([playerDummy2, playerDummy3], expect.toBeNumber());
    });

    test('BiddingPlayersRound players with second player inactive', () => {
      //inactivate player2
      addRaidResult(game, playerDummy2, false);
      addRaidResult(game, playerDummy2, false);

      game.getBiddingPlayersRound();

      //BiddingPlayersRound created with Game parameter members but player2 in the same order
      expect(BiddingPlayersRound)
        .toHaveBeenCalledWith([playerDummy1, playerDummy3], expect.toBeNumber());
    });

    /*  
        NOTE ON RANDOMNESS TESTS
        We only test:
          -That all possible random values are eventually generated.
          -That random values are within expected range.
          -That Math.random function has been used.
    */

    test('BiddingPlayersRound has random starter in 1st round', () => {
      const starters: number[] = [];
      const expectedStarters = playersDummy.map((player, index) => index);
      const indexChecks: boolean[] = [];
      
      const roundDummy = BiddingPlayersRoundDouble.createDouble();
      const startersTracker = (players: Player[], starter: number) => {
        starters.push(starter);
        indexChecks.push(starter < players.length);
        return roundDummy;
      };
            
      BiddingPlayersRoundMock.mockImplementation(startersTracker);

      while (!expectedStarters.every(starter => starters.includes(starter))) {
        game.getBiddingPlayersRound();
      }
      
      expect(expectedStarters)
        .toSatisfyAll(starter => starters.includes(starter));

      expect(indexChecks).toSatisfyAll(x => x === true);
    });

    test('Math.random is called in 1st round', () => {
      jest.spyOn(global.Math, 'random');

      game.getBiddingPlayersRound();
      
      expect(Math.random).toHaveBeenCalled();
    });

    test('BiddingPlayersRound has random starter if last raider inactive', () => {
      const starters: number[] = [];
      const expectedStarters = playersDummy.map((player, index) => index);
      const indexChecks: boolean[] = [];
      
      const roundDummy = BiddingPlayersRoundDouble.createDouble();
      const startersTracker = (players: Player[], starter: number) => {
        starters.push(starter);
        indexChecks.push(starter < players.length);
        return roundDummy;
      };
            
      BiddingPlayersRoundMock.mockImplementation(startersTracker);

      game.endRound({ raider: playerDummy2, survived: false });
      game.endRound({ raider: playerDummy2, survived: false });
      expectedStarters.splice(playersDummy.length - 1, 1);

      while (!expectedStarters.every(starter => starters.includes(starter))) {
        game.getBiddingPlayersRound();
      }
      
      expect(expectedStarters)
        .toSatisfyAll(starter => starters.includes(starter));

      expect(indexChecks).toSatisfyAll(x => x === true);
    });

    test('Math.random is called if last raider inactive', () => {
      jest.spyOn(global.Math, 'random');

      game.endRound({ raider: playerDummy2, survived: false });
      game.endRound({ raider: playerDummy2, survived: false });

      game.getBiddingPlayersRound();
      
      expect(Math.random).toHaveBeenCalledTimes(1);
    });

    test.each([0, 1, 2])( // Indexes of playersDummy
      'BiddingPlayersRound has last raider as starter (if active)', 
      playerIndex => {
        const expectedPlayersAmount = playersDummy.length;

        // Checks that players in BPR match playersDummy in the same order
        // Necessary to ensure that playerIndex is the same player in both arrays
        const playersArrayChecker = (array: Player[]) => {
          return array.length === expectedPlayersAmount
            && array.every((player, index) => player === playersDummy[index]);
        }

        game.endRound({ raider: playersDummy[playerIndex], survived: true });

        game.getBiddingPlayersRound();

        expect(BiddingPlayersRound).toHaveBeenCalledWith(
          expect.toSatisfy(playersArrayChecker), 
          expect.toSatisfy(x => x === playerIndex)
        );

        expect(BiddingPlayersRound).toHaveBeenCalledWith(
          expect.toSatisfy(playersArrayChecker), 
          expect.toSatisfy(x => x === playerIndex)
        );

        expect(BiddingPlayersRound).toHaveBeenCalledWith(
          expect.toBeArrayOfSize(expectedPlayersAmount), 
          expect.toBeWithin(0, expectedPlayersAmount)
        );
      }
    );

    test.each([0, 1, 2])( // Indexes of playersDummy
      'Math.random is not called if last raider is starter', 
      playerIndex => {
        jest.spyOn(global.Math, 'random');

        game.endRound({ raider: playersDummy[playerIndex], survived: true });

        game.getBiddingPlayersRound();

        expect(Math.random).not.toHaveBeenCalled();
      }
    );

    test('it returns instance of BiddingPlayersRound', () => {
      const round = game.getBiddingPlayersRound();

      expect(round).toBeInstanceOf(BiddingPlayersRound);
    });

    test('it throws error if called after a twice succesful raider', () => {
      addRaidResult(game, playerDummy2, true);
      addRaidResult(game, playerDummy2, true);

      expect(() => { game.getBiddingPlayersRound(); })
        .toThrowError('Unexpected call: game should have ended');
    });

    test('it throws error if called after one last player standing', () => {
      addRaidResult(game, playerDummy2, false);
      addRaidResult(game, playerDummy2, false);
      addRaidResult(game, playerDummy3, false);
      addRaidResult(game, playerDummy3, false);

      expect(() => { game.getBiddingPlayersRound(); })
        .toThrowError('Unexpected call: game should have ended');
    });
  });

  describe('endRound', () => {
    /*
      This method changes Game private state, and some of its side effects are
      tested through values returned by getBiddingPlayersRound in this method's 
      tests.
    */

    const unexpectedCall = () => {
      game.endRound({ raider: playerDummy2, survived: false });
    }

    test('it throws error if called after a twice succesful raider', () => {
      addRaidResult(game, playerDummy2, true);
      addRaidResult(game, playerDummy2, true);
  
      expect(unexpectedCall)
        .toThrowError('Unexpected call: game should have ended');
    });
  
    test('it throws error if called after one last player standing', () => {
      addRaidResult(game, playerDummy2, false);
      addRaidResult(game, playerDummy2, false);
      addRaidResult(game, playerDummy3, false);
      addRaidResult(game, playerDummy3, false);
  
      expect(unexpectedCall)
        .toThrowError('Unexpected call: game should have ended');
    });

    test('it throws error for third unsuccessful raid', () => {
      addRaidResult(game, playerDummy2, false);
      addRaidResult(game, playerDummy2, false);
  
      expect(unexpectedCall).toThrowError(
        `${playerDummy2.name} had lost, should not have been raider`
      );
    });
    
    test.each(
      [[[1, true]], [[1, false]]] as [number, boolean][][]
    )('it returns correct points representation', lastRaidResult => {
      const raidResults: [number, boolean][] = [
        [0, true], [1, true], [0, false], [2, false], [2, true], [1, false]
      ];
      raidResults.push(lastRaidResult);

      const expectedPoints: RoundResult['points'] = [];
      playersDummy.forEach(player => {
        expectedPoints.push({
          player,
          successfulRaids: 0,
          failedRaids: 0
        });
      });
      
      for (const result of raidResults) {
        const player = playersDummy[result[0]];
        const raidWasSuccessful = result[1];
        const playerPoints = expectedPoints
          .find(points => points.player === player) as 
          RoundResult['points'][number];
        
        if (raidWasSuccessful) playerPoints.successfulRaids++;
        else playerPoints.failedRaids++;

        const roundResult = game.endRound({
          raider: player,
          survived: raidWasSuccessful
        });

        expect(roundResult.points).toIncludeSameMembers(expectedPoints);
      }
    });

    test('roundResult.winner is undefined if there is no winner', () => {
      const raidResults: [number, boolean][] = [
        [0, true], [1, true], [0, false], [2, false], [2, true], [1, false]
      ];

      for (const result of raidResults) {
        const roundResult 
          = addRaidResult(game, playersDummy[result[0]], result[1]);

        expect(roundResult.winner).toBeUndefined();
      }
    });

    test('roundResult.winner contains a twice-successful winning player', () => {
      const raidResults: [number, boolean][] = [
        [0, true], [1, true], [0, false], [2, false]
      ];
      
      for (const result of raidResults) {
        addRaidResult(game, playersDummy[result[0]], result[1]);
      }

      const winningRaid = {
        raider: playersDummy[1],
        survived: true
      };
      const result = game.endRound(winningRaid);

      expect(result.winner).toBe(winningRaid.raider);
    });

    test('roundResult.winner contains a last-standing winning player', () => {
      const raidResults: [number, boolean][] = [
        [0, true], [1, false], [0, false], [0, false],
      ];

      for (const result of raidResults) {
        addRaidResult(game, playersDummy[result[0]], result[1]);
      }

      const result = game.endRound({
        raider: playersDummy[1],
        survived: false
      });

      expect(result.winner).toBe(playersDummy[2]);
    });
  });
});
