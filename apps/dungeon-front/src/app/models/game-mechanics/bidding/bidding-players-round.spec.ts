import { BiddingPlayersRound } from './bidding-players-round';
import { Player } from '../../models';
import { PlayerDouble } from '../../test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

function indexCheckerFactory(
  quittingPlayersIndexes: number[], initialPlayersAmount: number
) {
  return (indexes: number[]) => {
    let satisfies = true;

    for (let i = 0; i < indexes.length - 1; i++) {

      let expectedNextIndex = (indexes[i] + 1) % initialPlayersAmount;

      while (quittingPlayersIndexes.includes(expectedNextIndex)) {
        expectedNextIndex = (expectedNextIndex + 1) % initialPlayersAmount;
      }

      if (indexes[i + 1] !== expectedNextIndex) {
        satisfies = false;
        break;
      }
    }

    return satisfies;
  };
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

    test('getCurrentPlayer can be called', () => {
      round = new BiddingPlayersRound(players, starter);

      expect(() => { round.getCurrentPlayer(); }).not.toThrowError();
    });

    test('advanceToNextPlayer can be called', () => {
      round = new BiddingPlayersRound(players, starter);

      expect(() => { round.advanceToNextPlayer(); }).not.toThrowError();
    });

    test('currentPlayerWithdraws can be called', () => {
      round = new BiddingPlayersRound(players, starter);

      expect(() => { round.currentPlayerWithdraws(); }).not.toThrowError();
    });

    test('declareCurrentPlayerRaider can be called', () => {
      round = new BiddingPlayersRound(players, starter);

      expect(() => { round.declareCurrentPlayerRaider(); }).not.toThrowError();
    });

    test('getRaider cannot be called', () => {
      round = new BiddingPlayersRound(players, starter);

      expect(() => { round.getRaider(); })
        .toThrowError(
          'Bidding phase still active. Method should not have been called.'
        );
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

    test('getCurrentPlayer can be called', () => {
      expect(() => { round.getCurrentPlayer(); }).not.toThrowError();
    });
  
    test('advanceToNextPlayer can be called', () => {
      expect(() => { round.advanceToNextPlayer(); }).not.toThrowError();
    });
  
    test('currentPlayerWithdraws can be called', () => {
      expect(() => { round.currentPlayerWithdraws(); }).not.toThrowError();
    });
  
    test('declareCurrentPlayerRaider can be called', () => {
      expect(() => { round.declareCurrentPlayerRaider(); }).not.toThrowError();
    });
  
    test('getRaider cannot be called', () => {
      expect(() => { round.getRaider(); })
        .toThrowError(
          'Bidding phase still active. Method should not have been called.'
        );
    });

    test('remainingPlayersAmount is still length of players parameter', () => {
      expect(round.remainingPlayersAmount).toBe(players.length);
    });
  
    test('advanceToNextPlayer returns next player', () => {
      const player = round.advanceToNextPlayer();
      const index = (starter + turn + 1) % players.length;
      
      expect(player).toBe(players[index]);
    });
  });

  describe('currentPlayerWithdraws', () => {
    let starter: number;

    beforeEach(() => {
      starter = randomInteger(players.length, false);
    });

    describe.each([0, 1, 2, 3])('only player %i', quittingPlayerIndex => {
  
      beforeEach(() => {
        round = new BiddingPlayersRound(players, starter);
  
        while (round.getCurrentPlayer() !== players[quittingPlayerIndex]) {
          round.advanceToNextPlayer();
        }
      });
  
      test('getCurrentPlayer can be called', () => {
        round.currentPlayerWithdraws();
  
        expect(() => { round.getCurrentPlayer(); }).not.toThrowError();
      });
    
      test('advanceToNextPlayer can be called', () => {
        round.currentPlayerWithdraws();
  
        expect(() => { round.advanceToNextPlayer(); }).not.toThrowError();
      });
    
      test('currentPlayerWithdraws can be called', () => {
        round.currentPlayerWithdraws();
  
        expect(() => { round.currentPlayerWithdraws(); }).not.toThrowError();
      });
    
      test('declareCurrentPlayerRaider can be called', () => {
        round.currentPlayerWithdraws();
  
        expect(() => { round.declareCurrentPlayerRaider(); }).not.toThrowError();
      });
    
      test('getRaider cannot be called', () => {
        round.currentPlayerWithdraws();
  
        expect(() => { round.getRaider(); })
          .toThrowError(
            'Bidding phase still active. Method should not have been called.'
          );
      });
  
      test('remainingPlayersAmount has decreased by one', () => {
        round.currentPlayerWithdraws();
  
        expect(round.remainingPlayersAmount).toBe(players.length - 1);
      });
  
      test('currentPlayer has advanced by one', () => {
        const currentIndex = players
          .findIndex(player => player === round.getCurrentPlayer());
        const nextIndex = (currentIndex + 1) % players.length;
        const nextPlayer = players[nextIndex];
        
        round.currentPlayerWithdraws();
  
        expect(round.getCurrentPlayer()).toBe(nextPlayer);
      });
  
      test('round goes on without quitting player', () => {
        const turns = 10;
        const activePlayers: Player[] = [];
        const quittingPlayer = round.getCurrentPlayer();
  
        round.currentPlayerWithdraws();
  
        for (let i = 0; i < turns; i++) {
          activePlayers.push(round.getCurrentPlayer());
        }
  
        expect(activePlayers).not.toContain(quittingPlayer);
      });
  
      test('round keeps player order skipping quitting player', () => {
        const quittingPlayerIndexes = [quittingPlayerIndex];
        const indexChecker = 
          indexCheckerFactory(quittingPlayerIndexes, players.length);
  
        const turns = 10;
        const activePlayersIndexes: number[] = [];
  
        round.currentPlayerWithdraws();
  
        for (let i = 0; i < turns; i++) {
          const playerIndex = players
            .findIndex(player => player === round.getCurrentPlayer());
          activePlayersIndexes.push(playerIndex);
          round.advanceToNextPlayer();
        }
  
        expect(activePlayersIndexes).toSatisfy(indexChecker);
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
        let roundsBetweenWithdrawals: number;

        beforeEach(() => {
          roundsBetweenWithdrawals = randomInteger(4);

          round = new BiddingPlayersRound(players, starter);
    
          while (round.getCurrentPlayer() !== players[quittingPlayer1Index]) {
            round.advanceToNextPlayer();
          }

          round.currentPlayerWithdraws();

          while (roundsBetweenWithdrawals > 0) {
            round.advanceToNextPlayer();
            roundsBetweenWithdrawals--;
          }

          while (round.getCurrentPlayer() !== players[quittingPlayer2Index]) {
            round.advanceToNextPlayer();
          }
        });
    
        test('getCurrentPlayer can be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.getCurrentPlayer(); }).not.toThrowError();
        });
      
        test('advanceToNextPlayer can be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.advanceToNextPlayer(); }).not.toThrowError();
        });
      
        test('currentPlayerWithdraws can be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.currentPlayerWithdraws(); }).not.toThrowError();
        });
      
        test('declareCurrentPlayerRaider can be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.declareCurrentPlayerRaider(); }).not.toThrowError();
        });
      
        test('getRaider cannot be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.getRaider(); })
            .toThrowError(
              'Bidding phase still active. Method should not have been called.'
            );
        });
    
        test('remainingPlayersAmount has decreased by 2', () => {
          round.currentPlayerWithdraws();
    
          expect(round.remainingPlayersAmount).toBe(players.length - 2);
        });
    
        test('currentPlayer has advanced by 1', () => {
          const activePlayers = Array.from(players);
          activePlayers.splice(quittingPlayer1Index, 1);

          const currentIndex = activePlayers
            .findIndex(player => player === round.getCurrentPlayer());
          const nextIndex = (currentIndex + 1) % activePlayers.length;
          const nextPlayer = activePlayers[nextIndex];
          
          round.currentPlayerWithdraws();
    
          expect(round.getCurrentPlayer()).toBe(nextPlayer);
        });
    
        test('round goes on without quitting player', () => {
          const turns = 10;
          const activePlayers: Player[] = [];
          const quittingPlayer = round.getCurrentPlayer();
    
          round.currentPlayerWithdraws();
    
          for (let i = 0; i < turns; i++) {
            activePlayers.push(round.getCurrentPlayer());
          }
    
          expect(activePlayers).not.toContain(quittingPlayer);
        });
    
        test('round keeps player order skipping quitting player', () => {
          const quittingPlayerIndexes = [
            quittingPlayer1Index, quittingPlayer2Index
          ];
          const indexChecker = 
            indexCheckerFactory(quittingPlayerIndexes, players.length);
    
          const turns = 10;
          const activePlayersIndexes: number[] = [];
    
          round.currentPlayerWithdraws();
    
          for (let i = 0; i < turns; i++) {
            const playerIndex = players
              .findIndex(player => player === round.getCurrentPlayer());
            activePlayersIndexes.push(playerIndex);
            round.advanceToNextPlayer();
          }
    
          expect(activePlayersIndexes).toSatisfy(indexChecker);
        });
      }
    );

    describe.each([
      [0, 1, 2], [0, 1, 3], [0, 2, 1], [0, 2, 3], [0, 3, 1], [0, 3, 2],
      [1, 0, 2], [1, 0, 3], [1, 2, 0], [1, 2, 3], [1, 3, 0], [1, 3, 2], 
      [2, 0, 1], [2, 0, 3], [2, 1, 0], [2, 1, 3], [2, 3, 0], [2, 3, 1], 
      [3, 0, 1], [3, 0, 2], [3, 1, 0], [3, 1, 2], [3, 2, 0], [3, 2, 1]
    ])(
      'first player %i, then player %i, then player %i', 
      (quittingPlayer1Index, quittingPlayer2Index, quittingPlayer3Index) => {
        let roundsBetweenWithdrawals: number;

        beforeEach(() => {
          roundsBetweenWithdrawals = randomInteger(4);

          round = new BiddingPlayersRound(players, starter);
          const quittingIndexes = [
            quittingPlayer1Index, quittingPlayer2Index, quittingPlayer3Index
          ];

          while (quittingIndexes.length > 0) {
            const [index] = quittingIndexes.splice(0, 1);

            while (round.getCurrentPlayer() !== players[index]) {
              round.advanceToNextPlayer();
            }

            if (quittingIndexes.length > 0) {
              round.currentPlayerWithdraws();
  
              while (roundsBetweenWithdrawals > 0) {
                round.advanceToNextPlayer();
                roundsBetweenWithdrawals--;
              }

              roundsBetweenWithdrawals = randomInteger(4);
            }
          }
        });
    
        test('getCurrentPlayer cannot be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.getCurrentPlayer(); })
            .toThrowError(
              'Bidding phase has ended. Method should not have been called.'
            );
        });
      
        test('advanceToNextPlayer cannot be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.advanceToNextPlayer(); })
            .toThrowError(
              'Bidding phase has ended. Method should not have been called.'
            );
        });
      
        test('currentPlayerWithdraws cannot be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.currentPlayerWithdraws(); })
            .toThrowError(
              'Bidding phase has ended. Method should not have been called.'
            );
        });
      
        test('declareCurrentPlayerRaider cannnot be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.declareCurrentPlayerRaider(); })
            .toThrowError(
              'Bidding phase has ended. Method should not have been called.'
            );
        });
      
        test('getRaider can be called', () => {
          round.currentPlayerWithdraws();
    
          expect(() => { round.getRaider(); }).not.toThrowError();
        });
    
        test('remainingPlayersAmount has decreased by 3', () => {
          round.currentPlayerWithdraws();
    
          expect(round.remainingPlayersAmount).toBe(players.length - 3);
        });
    
        test('getRaider returns last active player', () => {
          const quittingIndexes = [
            quittingPlayer1Index, quittingPlayer2Index, quittingPlayer3Index
          ];
          const [activePlayer] = players
            .filter((player, index) => !quittingIndexes.includes(index));

          round.currentPlayerWithdraws();

          expect(round.getRaider()).toBe(activePlayer);
        });
      }
    );
  });

  describe.each([0, 1, 2, 3, 4, 5, 6, 7])('declareCurrentPlayerRaider', turn => {
    beforeEach(() => {
      const starter = randomInteger(4, false);
      round = new BiddingPlayersRound(players, starter);

      for (let i = 0; i < turn; i++) {
        round.advanceToNextPlayer();
      }
    });

    test('getCurrentPlayer cannot be called', () => {
      round.declareCurrentPlayerRaider();

      expect(() => { round.getCurrentPlayer(); })
        .toThrowError(
          'Bidding phase has ended. Method should not have been called.'
        );
    });
  
    test('advanceToNextPlayer cannot be called', () => {
      round.declareCurrentPlayerRaider();

      expect(() => { round.advanceToNextPlayer(); })
        .toThrowError(
          'Bidding phase has ended. Method should not have been called.'
        );
    });
  
    test('currentPlayerWithdraws cannot be called', () => {
      round.declareCurrentPlayerRaider();

      expect(() => { round.currentPlayerWithdraws(); })
        .toThrowError(
          'Bidding phase has ended. Method should not have been called.'
        );
    });
  
    test('declareCurrentPlayerRaider cannnot be called', () => {
      round.declareCurrentPlayerRaider();

      expect(() => { round.declareCurrentPlayerRaider(); })
        .toThrowError(
          'Bidding phase has ended. Method should not have been called.'
        );
    });
  
    test('getRaider can be called', () => {
      round.declareCurrentPlayerRaider();

      expect(() => { round.getRaider(); }).not.toThrowError();
    });

    test('remainingPlayersAmount to be 1', () => {
      round.declareCurrentPlayerRaider();

      expect(round.remainingPlayersAmount).toBe(1);
    });

    test('getRaider returns last turn\'s player', () => {
      const activePlayer = round.getCurrentPlayer();

      round.declareCurrentPlayerRaider();

      expect(round.getRaider()).toBe(activePlayer);
    });
  });
});
