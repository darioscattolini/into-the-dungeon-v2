import { BiddingPlayersRound } from './bidding-players-round';
import { Player } from '../../models';
import { PlayerDouble } from '../../test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

function findPlayerIndex(players: Player[], searched: Player): number {
  return players.findIndex(player => player === searched);
}

function checkPlayerIndexes(
  totalPlayers: number, indexes: number[], withdrawalTurns: number[]
): boolean {
  let validIndexes = true;
  let previousIndex = indexes[0];
  const withdrawingPlayersIndexes: number[] = [];

  for (let i = 0; i < indexes.length; i++) {
    if (i !== 0) {
      let expectedIndex = previousIndex;
    
      do {
        expectedIndex = (expectedIndex + 1) % totalPlayers;
      } while (withdrawingPlayersIndexes.includes(expectedIndex));

      if (expectedIndex !== indexes[i]) {
        validIndexes = false;
        break;
      }

      previousIndex = expectedIndex;
    }

    if (withdrawalTurns.includes(i)) {
      withdrawingPlayersIndexes.push(indexes[i]);
    }
  }

  return validIndexes;
}

describe('BiddingPlayersRound', () => {
  let players: Player[];
  let round: BiddingPlayersRound;

  beforeEach(() => {
    players = [
      PlayerDouble.createDouble(),
      PlayerDouble.createDouble(),
      PlayerDouble.createDouble(),
      PlayerDouble.createDouble()
    ];
  });

  describe.each([0, 1, 2, 3])('instantiation and initial state', starter => {
    test('it is created if starting player index < players length', () => {
      round = new BiddingPlayersRound(players, starter);
      
      expect(round).toBeTruthy();
    });

    test('it throws error if starting player index >= players length', () => {
      const outOfRange = starter + players.length;

      expect(() => { round = new BiddingPlayersRound(players, outOfRange); })
        .toThrowError('starterIndex must be within activePlayers index range.');
    });

    test('active bidding methods can be called', () => {
      round.currentPlayerWithdraws();

      expect(() => { round.getCurrentPlayer(); }).not.toThrowError();
      expect(() => { round.advanceToNextPlayer(); }).not.toThrowError();
      expect(() => { round.currentPlayerWithdraws(); }).not.toThrowError();
    });

    test('getLastBiddingPlayer cannot be called', () => {
      round = new BiddingPlayersRound(players, starter);

      expect(() => { round.getLastBiddingPlayer(); })
        .toThrowError('More than 1 player left. Bidding is still active.');
    });

    test('current player is starter player', () => {
      round = new BiddingPlayersRound(players, starter);

      expect(round.getCurrentPlayer()).toBe(players[starter]);
    });

    test('remainingPlayersAmount is length of players parameter', () => {
      round = new BiddingPlayersRound(players, starter);

      expect(round.remainingPlayersAmount).toBe(players.length);
    });
  });

  describe.each([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
  ])('advancing players: turn %i', turn => {
    let starter: number; 

    beforeEach(() => {
      starter = randomInteger(players.length, false);
      round = new BiddingPlayersRound(players, starter);

      for (let i = 0; i < turn; i++) {
        round.advanceToNextPlayer();
      }
    });

    test('active bidding methods can be called', () => {
      round.currentPlayerWithdraws();

      expect(() => { round.getCurrentPlayer(); }).not.toThrowError();
      expect(() => { round.advanceToNextPlayer(); }).not.toThrowError();
      expect(() => { round.currentPlayerWithdraws(); }).not.toThrowError();
    });
  
    test('getLastBiddingPlayer cannot be called', () => {
      expect(() => { round.getLastBiddingPlayer(); })
        .toThrowError('More than 1 player left. Bidding is still active.');
    });

    test('remainingPlayersAmount is still length of players parameter', () => {
      expect(round.remainingPlayersAmount).toBe(players.length);
    });
  
    test('advanceToNextPlayer makes next player currentPlayer', () => {
      round.advanceToNextPlayer();
      const index = (starter + turn + 1) % players.length;
      
      expect(round.getCurrentPlayer()).toBe(players[index]);
    });
  });

  describe.each([
    // not all possible combinations because there would be too many tests
    [0, 1], /*[0, 2], [0, 3],*/ [0, 4], 
    //[1, 1], [1, 2], [1, 3], [1, 4], 
    /*[3, 1],*/ [3, 2], /*[3, 3],*/ [3, 4],
    //[4, 1], [4, 2], [4, 3], [4, 4]
  ])(
    'currentPlayerWithdraws: starts %i, %i turns after 1st withdrawal', 
    (starter, turnsAfter1stWithdrawal) => {
      // maps turns (trackerIndex) with index of currentPlayer of those turns
      let playerTracker: number[];

      // tracks turns in which a player withdraws
      let withdrawalsTracker: number[];

      beforeEach(() => {
        playerTracker = [];
        withdrawalsTracker = [];
      });
    
      describe.each([0, 1, 2, 3])('only player %i', quittingPlayerIndex => {
    
        beforeEach(() => {
          round = new BiddingPlayersRound(players, starter);
          
          // advance round to first quitting player's turn
          while (round.getCurrentPlayer() !== players[quittingPlayerIndex]) {
            const currentPlayer = round.getCurrentPlayer();
            const currentPlayerIndex = findPlayerIndex(players, currentPlayer);
            playerTracker.push(currentPlayerIndex);

            round.advanceToNextPlayer();
          }

        });
    
        test('active bidding methods can be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.getCurrentPlayer(); }).not.toThrowError();
          expect(() => { round.advanceToNextPlayer(); }).not.toThrowError();
          expect(() => { round.currentPlayerWithdraws(); }).not.toThrowError();
        });
      
        test('getLastBiddingPlayer cannot be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.getLastBiddingPlayer(); })
            .toThrowError('More than 1 player left. Bidding is still active.');
        });
    
        test('remainingPlayersAmount has decreased by one', () => {
          round.currentPlayerWithdraws();
    
          expect(round.remainingPlayersAmount).toBe(players.length - 1);
        });
    
        test('currentPlayer has not advanced yet (triggered from outside)', () => {
          const quittingPlayer = round.getCurrentPlayer();
          round.currentPlayerWithdraws();
    
          expect(round.getCurrentPlayer()).toBe(quittingPlayer);
        });
    
        test('round keeps player order skipping quitting player', () => {
          turnsAfter1stWithdrawal = 10;
      
          round.currentPlayerWithdraws();

          // playerTracker.length represents current turn
          withdrawalsTracker.push(playerTracker.length);
          
          // advance round 10 more turns
          for (let i = 0; i < turnsAfter1stWithdrawal; i++) {
            const currentPlayer = round.getCurrentPlayer();
            const currentPlayerIndex = findPlayerIndex(players, currentPlayer);
            playerTracker.push(currentPlayerIndex);

            round.advanceToNextPlayer();
          }

          const indexesCheckResult = checkPlayerIndexes(
            players.length, playerTracker, withdrawalsTracker
          );

          const playersAfterWithdrawal = playerTracker
            .slice(withdrawalsTracker[0] + 1);
          
          expect(playersAfterWithdrawal).not.toContain(quittingPlayerIndex);
          expect(indexesCheckResult).toBeTrue();
        });
      });

      describe.each([
        [0, 1], [0, 2], [0, 3],
        [1, 0], [1, 2], [1, 3],
        [2, 0], [2, 1], [2, 3],
        [3, 0], [3, 1], [3, 2]
      ])(
        'first player %i, then player %i', 
        (quittingPlayer1Index, quittingPlayer2Index) => {        
          beforeEach(() => {
            round = new BiddingPlayersRound(players, starter);

            // advance round to first quitting player's turn
            while (round.getCurrentPlayer() !== players[quittingPlayer1Index]) {
              const currentPlayer = round.getCurrentPlayer();
              const currentPlayerIndex = findPlayerIndex(players, currentPlayer);
              playerTracker.push(currentPlayerIndex);

              round.advanceToNextPlayer();
            }

            // first quitting player withdraws
            round.currentPlayerWithdraws();
            // playerTracker.length represents current turn
            withdrawalsTracker.push(playerTracker.length);

            // advance round some more random turns
            while (turnsAfter1stWithdrawal > 0) {
              const currentPlayer = round.getCurrentPlayer();
              const currentPlayerIndex = findPlayerIndex(players, currentPlayer);
              playerTracker.push(currentPlayerIndex);

              round.advanceToNextPlayer();
              turnsAfter1stWithdrawal--;
            }

            // advance round to second quitting player's turn
            while (round.getCurrentPlayer() !== players[quittingPlayer2Index]) {
              const currentPlayer = round.getCurrentPlayer();
              const currentPlayerIndex = findPlayerIndex(players, currentPlayer);
              playerTracker.push(currentPlayerIndex);

              round.advanceToNextPlayer();
            }
          });
      
          test('active bidding methods can be called', () => {
            round.currentPlayerWithdraws();
      
            expect(() => { round.getCurrentPlayer(); }).not.toThrowError();
            expect(() => { round.advanceToNextPlayer(); }).not.toThrowError();
            expect(() => { round.currentPlayerWithdraws(); }).not.toThrowError();
          });
        
          test('getLastBiddingPlayer cannot be called', () => {
            round.currentPlayerWithdraws();
      
            expect(() => { round.getLastBiddingPlayer(); })
              .toThrowError('More than 1 player left. Bidding is still active.');
          });
      
          test('remainingPlayersAmount has decreased by 2', () => {
            round.currentPlayerWithdraws();
      
            expect(round.remainingPlayersAmount).toBe(players.length - 2);
          });
      
          test('currentPlayer has advanced by 1', () => {
            const lastQuittingPlayer = round.getCurrentPlayer();
            round.currentPlayerWithdraws();
    
            expect(round.getCurrentPlayer()).toBe(lastQuittingPlayer);
          });
      
          test('round keeps player order skipping quitting player', () => {
            const turnsAfter2ndWithdrawal = 10;
      
            round.currentPlayerWithdraws();

            // playerTracker.length represents current turn
            withdrawalsTracker.push(playerTracker.length);
            
            // advance round 10 more turns
            for (let i = 0; i < turnsAfter2ndWithdrawal; i++) {
              const currentPlayer = round.getCurrentPlayer();
              const currentPlayerIndex = findPlayerIndex(players, currentPlayer);
              playerTracker.push(currentPlayerIndex);

              round.advanceToNextPlayer();
            }

            const indexesCheckResult = checkPlayerIndexes(
              players.length, playerTracker, withdrawalsTracker
            );

            const playersAfter1stWithdrawal = playerTracker
              .slice(withdrawalsTracker[0] + 1);
            const playersAfter2ndWithdrawal = playerTracker
              .slice(withdrawalsTracker[1] + 1);
          
            expect(playersAfter1stWithdrawal).not.toContain(quittingPlayer1Index);
            expect(playersAfter2ndWithdrawal).not.toContain(quittingPlayer2Index);
            expect(indexesCheckResult).toBeTrue();
          });
        }
      );

      describe.each([
        // not all possible combinations because there would be too many tests
        [0, 1, 2], /*[0, 1, 3], [0, 2, 1], [0, 2, 3],*/ [0, 3, 1], //[0, 3, 2],
        /*[1, 0, 2], [1, 0, 3], [1, 2, 0],*/ [1, 2, 3], /*[1, 3, 0],*/ [1, 3, 2], 
        /*[2, 0, 1],*/ [2, 0, 3], [2, 1, 0], /*[2, 1, 3], [2, 3, 0], [2, 3, 1],*/
        [3, 0, 1], /*[3, 0, 2], [3, 1, 0], [3, 1, 2],*/ [3, 2, 0], //[3, 2, 1]
      ])(
        'first player %i, then player %i, then player %i', 
        (quittingPlayer1Index, quittingPlayer2Index, quittingPlayer3Index) => {
          beforeEach(() => {
            round = new BiddingPlayersRound(players, starter);
            const quittingIndexes = [
              quittingPlayer1Index, quittingPlayer2Index, quittingPlayer3Index
            ];

            while (quittingIndexes.length > 0) {
              const turnsAfterWithdrawal = turnsAfter1stWithdrawal;
              const [index] = quittingIndexes.splice(0, 1);

              while (round.getCurrentPlayer() !== players[index]) {
                round.advanceToNextPlayer();
              }

              if (quittingIndexes.length > 0) {
                round.currentPlayerWithdraws();
    
                while (turnsAfter1stWithdrawal > 0) {
                  round.advanceToNextPlayer();
                  turnsAfter1stWithdrawal--;
                }
              }
            }
          });

          test('active bidding methods cannot be called', () => {
            round.currentPlayerWithdraws();
            const message 
              = 'Bidding phase has ended. Method should not have been called.';
      
            expect(() => { round.getCurrentPlayer(); }).toThrowError(message);
            expect(() => { round.advanceToNextPlayer(); }).toThrowError(message);
            expect(() => { round.currentPlayerWithdraws(); })
              .toThrowError(message);
          });
        
          test('getLastBiddingPlayer can be called', () => {
            round.currentPlayerWithdraws();
      
            expect(() => { round.getLastBiddingPlayer(); }).not.toThrowError();
          });
      
          test('remainingPlayersAmount has decreased by 3', () => {
            round.currentPlayerWithdraws();
      
            expect(round.remainingPlayersAmount).toBe(players.length - 3);
          });
      
          test('getLastBiddingPlayer returns last bidding player', () => {
            const quittingIndexes = [
              quittingPlayer1Index, quittingPlayer2Index, quittingPlayer3Index
            ];
            const [expectedLastBiddingPlayer] = players
              .filter((player, index) => !quittingIndexes.includes(index));

            round.currentPlayerWithdraws();

            expect(round.getLastBiddingPlayer()).toBe(expectedLastBiddingPlayer);
          });
        }
      );
    }
  );
});
