import { Game } from './game';
import { Player, RaidResult, BiddingPlayersRound } from '../models';
import { PlayerDouble } from '../test-doubles';

jest.mock('./bidding/bidding-players-round');

function buildPlayersDummy(amount: number): Player[] {
  const players = [];

  for (let i = 0; i < amount; i++) {
    players.push(PlayerDouble.createDouble());
  }

  return players;
}

function addRaidResult(game: Game, raider: Player, survived: boolean) {
  const raidResult: RaidResult = { raider, survived };
  game.endRound(raidResult);
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
  let game: Game;
    
  beforeEach(() => {
    playerDummy1 = PlayerDouble.createDouble();
    playerDummy2 = PlayerDouble.createDouble();
    playerDummy3 = PlayerDouble.createDouble();
    game = new Game([playerDummy1, playerDummy2, playerDummy3]);
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
    test('BiddingPlayersRound creation: no inactive players yet', () => {
      game.getBiddingPlayersRound();

      // BiddingPlayersRound created with Game parameter members in the same order
      expect(BiddingPlayersRound)
        .toHaveBeenCalledWith([playerDummy1, playerDummy2, playerDummy3]);
    });

    test('BiddingPlayersRound creation: first player inactive', () => {
      //inactivate player1
      addRaidResult(game, playerDummy1, false);
      addRaidResult(game, playerDummy1, false);

      game.getBiddingPlayersRound();

      //BiddingPlayersRound created with Game parameter members but player1 in the same order
      expect(BiddingPlayersRound)
        .toHaveBeenCalledWith([playerDummy2, playerDummy3]);
    });

    test('BiddingPlayersRound creation: middle player inactive', () => {
      //inactivate player2
      addRaidResult(game, playerDummy2, false);
      addRaidResult(game, playerDummy2, false);

      game.getBiddingPlayersRound();

      //BiddingPlayersRound created with Game parameter members but player2 in the same order
      expect(BiddingPlayersRound)
        .toHaveBeenCalledWith([playerDummy1, playerDummy3]);
    });

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
      tested through values returned by getBiddingPlayersRound and getWinner in
      these methods' tests.
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

    test('it returns empty object for 1st successful raid', () => {      
      const roundResult = game.endRound({ 
        raider: playerDummy2, 
        survived: true
      });

      expect(roundResult).toEqual({});
    });

    test('it returns empty object for 2nd successful raid', () => {
      addRaidResult(game, playerDummy2, true);
  
      const roundResult = game.endRound({ 
        raider: playerDummy2, 
        survived: true
      });

      expect(roundResult).toEqual({});
    });

    test('it returns empty object for 1st unsuccessful raid', () => {  
      const roundResult = game.endRound({ 
        raider: playerDummy2, 
        survived: false
      });

      expect(roundResult).toEqual({});
    });

    test('it returns out-of-game notification for 2nd unsuccessful raid', () => {
      addRaidResult(game, playerDummy2, false);
  
      const roundResult = game.endRound({ 
        raider: playerDummy2, 
        survived: false
      });

      expect(roundResult).toEqual({ outOfGame: playerDummy2 });
    });
  });
  
  describe('getWinner as affected by endRound', () => {
    test('it returns undefined if there is no winner', () => {
      addRaidResult(game, playerDummy1, true);  // Player 1: 1 success
      addRaidResult(game, playerDummy2, false); // Player 2: 1 failure
      addRaidResult(game, playerDummy3, true);  // Player 3: 1 success + 1 failure
      addRaidResult(game, playerDummy3, false);

      expect(game.getWinner()).toBeUndefined();
    });
  
    test('it returns a twice-successful winning player', () => {
      addRaidResult(game, playerDummy1, true);  // Player 1: 1 success
      addRaidResult(game, playerDummy2, false); // Player 2: 1 failure
      addRaidResult(game, playerDummy3, false); // Player 3: 1 failure + 2 success
      addRaidResult(game, playerDummy3, true);
      
      expect(game.getWinner()).toBeUndefined();

      addRaidResult(game, playerDummy3, true);

      expect(game.getWinner()).toBe(playerDummy3);
    });
  
    test('it returns a last-standing winning player', () => {
      addRaidResult(game, playerDummy1, true);  // Player 1: 1 success
      addRaidResult(game, playerDummy2, false); // Player 2: 2 failures
      addRaidResult(game, playerDummy2, false);
      addRaidResult(game, playerDummy3, true);  // Player 3: 1 success + 2 failures
      addRaidResult(game, playerDummy3, false);

      expect(game.getWinner()).toBeUndefined();

      addRaidResult(game, playerDummy3, false);

      expect(game.getWinner()).toBe(playerDummy1);
    });
  });
});
