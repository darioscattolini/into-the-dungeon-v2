import { Bidding } from './bidding';
import { BiddingPlayersRound } from './bidding-players-round';
import {
  BiddingActionResponseContent,
  BidParticipationResponseContent,
  MonsterAdditionResponseContent,
  EquipmentRemovalResponseContent
} from './bidding-action';
import {
  Player,
  Hero,
  AnyMonster,
  MonsterType,
  EquipmentName
} from '../../models';
import {
  BiddingPlayersRoundDouble,
  HeroDouble,
  MonsterDouble,
  PlayerDouble,
  pickRandomEquipmentNames
} from '../../test-doubles';
import { randomInteger } from '@into-the-dungeon/util-testing';

function getPublicState(bidding: Bidding) {
  return {
    currentPhase: bidding.currentPhase,
    currentPlayer: bidding.currentPlayer,
    monstersPackAmount: bidding.monstersPackAmount,
    monstersInDungeonAmount: bidding.monstersInDungeonAmount
  };
}

type BiddingPublicState = ReturnType<typeof getPublicState>;

function playBiddingDummy(): BidParticipationResponseContent { 
  return { action: 'play-bidding', content: true };
}

function withdrawDummy(): BidParticipationResponseContent { 
  return { action: 'play-bidding', content: false };
}

function addMonsterDummy(): MonsterAdditionResponseContent { 
  return { action: 'add-monster', content: true };
}

function dontAddMonsterDummy(): MonsterAdditionResponseContent { 
  return { action: 'add-monster', content: false };
}

function removeEquipmentDummy(): EquipmentRemovalResponseContent { 
  return { action: 'remove-equipment', content: pickRandomEquipmentNames(1)[0] };
}

function buildAllResponseDummies(): BiddingActionResponseContent[] {
  return [
    playBiddingDummy(), withdrawDummy(),
    addMonsterDummy(), dontAddMonsterDummy(),
    removeEquipmentDummy()
  ];
}

describe('Bidding', () => {
  let playersMock: BiddingPlayersRound;
  let heroMock: Hero;
  let monstersPackDummy: AnyMonster[];
  let bidding: Bidding;
  let currentPlayerDummy: Player;
  let nextPlayerDummy: Player;
  let pickedMonster: AnyMonster;
  let equipmentOptions: EquipmentName[];
  let lastBiddingPlayerDummy: Player;
  let previousState: BiddingPublicState;

  beforeEach(() => {
    playersMock = BiddingPlayersRoundDouble.createDouble();
    heroMock = HeroDouble.createDouble();
    monstersPackDummy = [
      MonsterDouble.createDouble(), MonsterDouble.createDouble()
    ];
    currentPlayerDummy = PlayerDouble.createDouble();
    nextPlayerDummy = PlayerDouble.createDouble();
    equipmentOptions = pickRandomEquipmentNames(6);
    lastBiddingPlayerDummy = PlayerDouble.createDouble();
    
    Object.defineProperty(playersMock, 'remainingPlayersAmount', { value: 3 });
    
    jest.spyOn(playersMock, 'getCurrentPlayer')
      .mockReturnValue(currentPlayerDummy);

    jest.spyOn(playersMock, 'currentPlayerWithdraws')
      .mockImplementation(() => {
        const playersAmount = playersMock.remainingPlayersAmount;

        Object.defineProperty(playersMock, 'remainingPlayersAmount', { 
          value: playersAmount - 1 
        });

        jest.spyOn(playersMock, 'getCurrentPlayer')
          .mockReturnValue(nextPlayerDummy);
      });

    jest.spyOn(playersMock, 'advanceToNextPlayer')
      .mockImplementation(() => {
        jest.spyOn(playersMock, 'getCurrentPlayer')
          .mockReturnValue(nextPlayerDummy);
        return nextPlayerDummy;
      });
    
    jest.spyOn(playersMock, 'getLastBiddingPlayer')
      .mockReturnValue(lastBiddingPlayerDummy);

    jest.spyOn(heroMock, 'getMountedEquipment')
      .mockReturnValue(equipmentOptions);
    
    // avoid coupling test to method's constraints
    jest.spyOn(heroMock, 'discardEquipmentPiece')
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('instantiation and initial state', () => {
    test('it is created', () => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

      expect(bidding).toBeTruthy();
    });

    test('currentPhase is play-bidding', () => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

      expect(bidding.currentPhase).toBe('play-bidding');
    });

    test('currentPlayer has not changed', () => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

      expect(bidding.currentPlayer).toBe(currentPlayerDummy);
    });

    test('currentPlayer is biddingPlayersRound currentPlayer', () => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

      expect(bidding.currentPlayer).toBe(playersMock.getCurrentPlayer());
    });

    test('bidding players have not changed', () => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

      expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
    });

    test('monstersPackAmount equals initial monstersPack length', () => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

      expect(bidding.monstersPackAmount).toBe(monstersPackDummy.length);
    });

    test('monstersInDungeonAmount is 0', () => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

      expect(bidding.monstersInDungeonAmount).toBe(0);
    });

    test('getActionRequestData can be called', () => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

      expect(() => { bidding.getActionRequestData(); }).not.toThrowError();
    });

    test.each(buildAllResponseDummies())(
      'onResponse cannot be called with any BiddingActionResponse yet', 
      response => {
        bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

        expect(() => { bidding.onResponse(response); })
          .toThrowError('A user action must be previously requested.');
      }
    );

    test('getResult cannot be called yet', () => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

      expect(() => { bidding.getResult(); })
        .toThrowError('Bidding phase has not ended yet.');
    });

    test('bidding goes on', () => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

      expect(bidding.goesOn()).toBeTrue();
    });
  });

  describe('play-bidding action request demanded', () => {
    beforeEach(() => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
      previousState = getPublicState(bidding);
    });

    test('public state has not changed', () => {
      bidding.getActionRequestData();
      const currentState = getPublicState(bidding);

      expect(currentState).toEqual(previousState);
    });

    test('currentPlayer is biddingPlayersRound currentPlayer', () => {
      bidding.getActionRequestData();

      expect(bidding.currentPlayer).toBe(playersMock.getCurrentPlayer());
    });

    test('bidding players have not changed', () => {
      bidding.getActionRequestData();

      expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
    });
    
    test('getActionRequestData cannot be called right after', () => {
      bidding.getActionRequestData();

      expect(() => { bidding.getActionRequestData(); })
        .toThrowError('A user response to a previous request is pending.');
    });

    test.each([
      playBiddingDummy(), withdrawDummy()
    ])('onResponse can be called with BidParticipationResponse', response => {
      bidding.getActionRequestData();

      expect(() => { bidding.onResponse(response); }).not.toThrowError();
    });

    test.each([
      addMonsterDummy(), dontAddMonsterDummy(), removeEquipmentDummy()
    ])(
      'onResponse cannot be called with MonsterAddition/EquipmentRemoval Response', 
      response => {
        bidding.getActionRequestData();
        
        expect(() => { bidding.onResponse(response); })
          .toThrowError('A response of "play-bidding" type was expected.');
      }
    );

    test('getResult cannot be called', () => {
      bidding.getActionRequestData();

      expect(() => { bidding.getResult(); })
        .toThrowError('Bidding phase has not ended yet.');
    });

    test('bidding goes on', () => {
      bidding.getActionRequestData();

      expect(bidding.goesOn()).toBeTrue();
    });

    test('getActionRequestData returns a play-bidding request', () => {
      const request = bidding.getActionRequestData();

      expect(request).toContainAllKeys(['action', 'player', 'content', 'state']);
      expect(request.action).toBe('play-bidding');
      expect(request.content).toBeUndefined();
      expect(request.state).toContainAllKeys([
        'dungeon', 'hero', 'remainingMonsters', 'remainingPlayers'
      ]);
    });

    test('getActionRequestData is targeted at current player', () => {
      const playerDummy = PlayerDouble.createDouble();
      jest.spyOn(playersMock, 'getCurrentPlayer').mockReturnValue(playerDummy);
      
      const request = bidding.getActionRequestData();

      expect(request.player).toBe(playerDummy);
    });

    test('getActionRequestData state reflects current bidding state', () => {
      const state = bidding.getActionRequestData().state;

      expect(state.dungeon.length).toBe(bidding.monstersInDungeonAmount);
      expect(state.hero).toBe(heroMock);
      expect(state.remainingMonsters).toBe(bidding.monstersPackAmount);
      expect(state.remainingPlayers).toBe(playersMock.remainingPlayersAmount);
    });
  });

  describe('play-bidding request accepted', () => {    
    describe('0 equipment, 1 monster left', () => {
      // SCENARIO (2) IN bidding.ts

      beforeEach(() => {
        jest.spyOn(heroMock, 'getMountedEquipment')
          .mockReturnValue(pickRandomEquipmentNames(0));

        monstersPackDummy = [ MonsterDouble.createDouble() ];
        [pickedMonster] = monstersPackDummy;
        bidding = new Bidding(playersMock, heroMock, monstersPackDummy);  
        bidding.getActionRequestData();
        previousState = getPublicState(bidding);
      });

      test('currentPhase is bidding-ended', () => {
        bidding.onResponse(playBiddingDummy());
  
        expect(bidding.currentPhase).toBe('bidding-ended');
      });

      test('currentPlayer is now null', () => {
        bidding.onResponse(playBiddingDummy());

        expect(bidding.currentPlayer).toBeNull();
      });

      test('players.currentPlayerWithdraws has not been called', () => {
        bidding.onResponse(playBiddingDummy());

        expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
      });

      test('monstersPackAmount has decreased by 1', () => {
        bidding.onResponse(playBiddingDummy());
          
        expect(bidding.monstersPackAmount)
          .toBe(previousState.monstersPackAmount - 1);
      });

      test('monstersInDungeon has increased by 1', () => {
        bidding.onResponse(playBiddingDummy());
          
        expect(bidding.monstersInDungeonAmount)
          .toBe(previousState.monstersInDungeonAmount + 1);
      });

      test('getActionRequestData cannot be called', () => {
        bidding.onResponse(playBiddingDummy());

        expect(() => { bidding.getActionRequestData(); })
          .toThrowError(
            'Bidding phase has ended, method should not have been called.'
          );
      });

      test.each(buildAllResponseDummies())(
        'onResponse cannot be called with any BiddingActionResponse anymore', 
        response => {
          bidding.onResponse(playBiddingDummy());
  
          expect(() => { bidding.onResponse(response); })
            .toThrowError(
              'Bidding phase has ended, method should not have been called.'
            );
        }
      );

      test('getResult can be called', () => {
        bidding.onResponse(playBiddingDummy());
  
        expect(() => { bidding.getResult(); }).not.toThrowError();
      });

      test('bidding has ended', () => {
        bidding.onResponse(playBiddingDummy());
          
        expect(bidding.goesOn()).toBeFalse();
      });

      test('onResponse returns notification of forcibly added monster', () => {
        const notification = bidding.onResponse(playBiddingDummy()).notification;

        expect(notification).toBeDefined();
        expect(notification?.player).toBe(previousState.currentPlayer);
        expect(notification?.forciblyAddedMonster).toBe(pickedMonster.type);
      });

      test('getResult returns expected reason and raid participants', () => {
        bidding.onResponse(playBiddingDummy());

        const result = bidding.getResult();
  
        expect(result.endReason).toBe('no-monsters');
        expect(result.raider).toBe(previousState.currentPlayer);
        expect(result.hero).toBe(heroMock);
        expect(result.enemies).toEqual([pickedMonster]);
      });
    });

    describe.each([2, 3, 4])('0 equipment, %i monsters left', monstersLeft => {
      // SCENARIO (1) IN bidding.ts

      beforeEach(() => {
        jest.spyOn(heroMock, 'getMountedEquipment')
          .mockReturnValue(pickRandomEquipmentNames(0));

        monstersPackDummy = [];

        for (let i = 0; i < monstersLeft; i++) {
          monstersPackDummy.push(MonsterDouble.createDouble());
        }

        pickedMonster = monstersPackDummy[monstersPackDummy.length - 1];

        bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
        bidding.getActionRequestData();
        previousState = getPublicState(bidding);
      });

      test('currentPhase is play-bidding', () => {
        bidding.onResponse(playBiddingDummy());
  
        expect(bidding.currentPhase).toBe('play-bidding');
      });

      test('currentPlayer has advanced', () => {
        bidding.onResponse(playBiddingDummy());

        expect(bidding.currentPlayer).toBe(nextPlayerDummy);
      });

      test('currentPlayer is biddingPlayersRound currentPlayer', () => {
        bidding.onResponse(playBiddingDummy());

        expect(bidding.currentPlayer).toBe(playersMock.getCurrentPlayer());
      });

      test('bidding players have not changed', () => {
        bidding.onResponse(playBiddingDummy());

        expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
      });

      test('monstersPackAmount has decreased by 1', () => {
        bidding.onResponse(playBiddingDummy());
          
        expect(bidding.monstersPackAmount)
          .toBe(previousState.monstersPackAmount - 1);
      });

      test('monstersInDungeon has increased by 1', () => {
        bidding.onResponse(playBiddingDummy());
          
        expect(bidding.monstersInDungeonAmount)
          .toBe(previousState.monstersInDungeonAmount + 1);
      });

      test('getActionRequestData can be called', () => {
        bidding.onResponse(playBiddingDummy());
        
        expect(() => { bidding.getActionRequestData(); }).not.toThrowError();
      });

      test.each(buildAllResponseDummies())(
        'onResponse cannot be called with any BiddingActionResponse yet', 
        response => {
          bidding.onResponse(playBiddingDummy());

          expect(() => { bidding.onResponse(response); })
            .toThrowError('A user action must be previously requested.');
        }
      );

      test('getResult cannot be called yet', () => {
        bidding.onResponse(playBiddingDummy());
  
        expect(() => { bidding.getResult(); })
          .toThrowError('Bidding phase has not ended yet.');
      });

      test('bidding goes on', () => {
        bidding.onResponse(playBiddingDummy());
          
        expect(bidding.goesOn()).toBeTrue();
      });

      test('getActionRequestData returns a play-bidding request', () => {
        bidding.onResponse(playBiddingDummy());
        const request = bidding.getActionRequestData();
  
        expect(request)
          .toContainAllKeys(['action', 'player', 'content', 'state']);
        expect(request.action).toBe('play-bidding');
        expect(request.content).toBeUndefined();
        expect(request.state).toContainAllKeys([
          'dungeon', 'hero', 'remainingMonsters', 'remainingPlayers'
        ]);
      });
  
      test('getActionRequestData is targeted at next player', () => {
        bidding.onResponse(playBiddingDummy());
        const target = bidding.getActionRequestData().player;

        expect(target).toBe(nextPlayerDummy);
      });
  
      test('getActionRequestData state reflects current bidding state', () => {
        bidding.onResponse(playBiddingDummy());
        const state = bidding.getActionRequestData().state;
  
        expect(state.dungeon.length).toBe(bidding.monstersInDungeonAmount);
        expect(state.hero).toBe(heroMock);
        expect(state.remainingMonsters).toBe(bidding.monstersPackAmount);
        expect(state.remainingPlayers).toBe(playersMock.remainingPlayersAmount);
      });
      
      test('onResponse returns notification of forcibly added monster', () => {
        const notification = bidding.onResponse(playBiddingDummy()).notification;

        expect(notification).toBeDefined();
        expect(notification?.player).toBe(previousState.currentPlayer);
        expect(notification?.forciblyAddedMonster).toBe(pickedMonster.type);
      });
    });

    describe.each([
      [1, 1], [1, 2], [1, 3],
      [2, 1], [2, 2], [2, 3],
      [3, 1], [3, 2], [3, 3]
    ])('%i equipment, %i monsters left', (equipmentLeft, monstersLeft) => {
      // SCENARIO (3) IN bidding.ts

      beforeEach(() => {
        jest.spyOn(heroMock, 'getMountedEquipment')
          .mockReturnValue(pickRandomEquipmentNames(equipmentLeft));

        monstersPackDummy = [];

        for (let i = 0; i < monstersLeft; i++) {
          monstersPackDummy.push(MonsterDouble.createDouble());
        }

        pickedMonster = monstersPackDummy[monstersPackDummy.length - 1];

        bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
        bidding.getActionRequestData();
        previousState = getPublicState(bidding);
      });

      test('currentPhase is add-monster', () => {
        bidding.onResponse(playBiddingDummy());
  
        expect(bidding.currentPhase).toBe('add-monster');
      });

      test('currentPlayer has not changed', () => {
        bidding.onResponse(playBiddingDummy());

        expect(bidding.currentPlayer).toBe(previousState.currentPlayer);
      });

      test('currentPlayer is biddingPlayersRound currentPlayer', () => {
        bidding.onResponse(playBiddingDummy());

        expect(bidding.currentPlayer).toBe(playersMock.getCurrentPlayer());
      });

      test('bidding players have not changed', () => {
        bidding.onResponse(playBiddingDummy());

        expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
      });
      
      test('monstersPackAmount has decreased by one', () => {
        bidding.onResponse(playBiddingDummy());
          
        expect(bidding.monstersPackAmount)
          .toBe(previousState.monstersPackAmount - 1);
      });

      test('monstersInDungeon has not increased yet', () => {
        bidding.onResponse(playBiddingDummy());
          
        expect(bidding.monstersInDungeonAmount)
          .toBe(previousState.monstersInDungeonAmount);
      });

      test('getActionRequestData can be called', () => {
        bidding.onResponse(playBiddingDummy());
  
        expect(() => { bidding.getActionRequestData(); }).not.toThrowError();
      });

      test.each(buildAllResponseDummies())(
        'onResponse cannot be called with any BiddingActionResponse yet', 
        response => {
          bidding.onResponse(playBiddingDummy());

          expect(() => { bidding.onResponse(response); })
            .toThrowError('A user action must be previously requested.');
        }
      );

      test('getResult cannot be called', () => {
        bidding.onResponse(playBiddingDummy());
  
        expect(() => { bidding.getResult(); })
          .toThrowError('Bidding phase has not ended yet.');
      });

      test('bidding goes on', () => {
        bidding.onResponse(playBiddingDummy());
          
        expect(bidding.goesOn()).toBeTrue();
      });

      test('getActionRequestData returns an add-monster request', () => {
        bidding.onResponse(playBiddingDummy());
        const request = bidding.getActionRequestData();
  
        expect(request)
          .toContainAllKeys(['action', 'player', 'content', 'state']);
        expect(request.action).toBe('add-monster');
        expect(request.content).toBeDefined();
        expect(request.state).toContainAllKeys([
          'dungeon', 'hero', 'remainingMonsters', 'remainingPlayers'
        ]);
      });
  
      test('getActionRequestData is targeted at current player', () => {
        bidding.onResponse(playBiddingDummy());
        const request = bidding.getActionRequestData();

        expect(request.player).toBe(previousState.currentPlayer);
      });

      test('getActionRequestData content is picked monster', () => {
        bidding.onResponse(playBiddingDummy());
        const request = bidding.getActionRequestData();

        expect(request.content).toBe(pickedMonster.type);
      });
  
      test('getActionRequestData state reflects current bidding state', () => {
        bidding.onResponse(playBiddingDummy());
        const state = bidding.getActionRequestData().state;
  
        expect(state.dungeon.length).toBe(bidding.monstersInDungeonAmount);
        expect(state.hero).toBe(heroMock);
        expect(state.remainingMonsters).toBe(bidding.monstersPackAmount);
        expect(state.remainingPlayers).toBe(playersMock.remainingPlayersAmount);
      });

      test('onResponse returns empty notification', () => {
        const notification = bidding.onResponse(playBiddingDummy());

        expect(notification.notification).toBeUndefined();
      });
    });
  });

  describe('play-bidding request rejected (withdraw)', () => {
    describe('2 players left', () => {
      // SCENARIO (5) IN bidding.ts

      beforeEach(() => {
        Object.defineProperty(playersMock, 'remainingPlayersAmount', {
          value: 2
        });

        bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
        bidding.getActionRequestData();
        previousState = getPublicState(bidding);
      });

      test('currentPhase is bidding-ended', () => {
        bidding.onResponse(withdrawDummy());
  
        expect(bidding.currentPhase).toBe('bidding-ended');
      });

      test('currentPlayer is now null', () => {
        bidding.onResponse(withdrawDummy());

        expect(bidding.currentPlayer).toBeNull();
      });

      test('players.currentPlayerWithdraws has been called', () => {
        bidding.onResponse(withdrawDummy());

        expect(playersMock.currentPlayerWithdraws).toHaveBeenCalled();
      });

      test('monstersPackAmount has not changed', () => {
        bidding.onResponse(withdrawDummy());
          
        expect(bidding.monstersPackAmount)
          .toBe(previousState.monstersPackAmount);
      });

      test('monstersInDungeon has not changed', () => {
        bidding.onResponse(withdrawDummy());
          
        expect(bidding.monstersInDungeonAmount)
          .toBe(previousState.monstersInDungeonAmount);
      });
      
      test('getActionRequestData cannot be called', () => {
        bidding.onResponse(withdrawDummy());

        expect(() => { bidding.getActionRequestData(); })
          .toThrowError(
            'Bidding phase has ended, method should not have been called.'
          );
      });

      test.each(buildAllResponseDummies())(
        'onResponse cannot be called with any BiddingActionResponse anymore', 
        response => {
          bidding.onResponse(withdrawDummy());
  
          expect(() => { bidding.onResponse(response); })
            .toThrowError(
              'Bidding phase has ended, method should not have been called.'
            );
        }
      );

      test('getResult can be called', () => {
        bidding.onResponse(withdrawDummy());
  
        expect(() => { bidding.getResult(); }).not.toThrowError();
      });

      test('bidding has ended', () => {
        bidding.onResponse(withdrawDummy());
          
        expect(bidding.goesOn()).toBeFalse();
      });

      test('onResponse returns empty notification', () => {
        const notification = bidding.onResponse(withdrawDummy());

        expect(notification.notification).toBeUndefined();
      });

      test('getResult returns expected reason and raid participants', () => {
        bidding.onResponse(withdrawDummy());

        const result = bidding.getResult();
        
        expect(result.endReason).toBe('last-bidding-player');
        expect(result.raider).toBe(lastBiddingPlayerDummy);
        expect(result.hero).toBe(heroMock);
        expect(result.enemies).toBeArrayOfSize(0);
      });
    });

    describe.each([3, 4])('%i (more than 2) players left', playersAmount => {
      // SCENARIO (4) IN bidding.ts

      beforeEach(() => {
        Object.defineProperty(playersMock, 'remainingPlayersAmount', {
          get: jest.fn(() => playersAmount),
        });
        
        /* THIS SHOULD WORK BUT DOESN'T
        jest.spyOn(playersMock, 'remainingPlayersAmount', 'get')
          .mockReturnValue(playersAmount); */

        bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
        bidding.getActionRequestData();
        previousState = getPublicState(bidding);
      });

      test('currentPhase is play-bidding', () => {
        bidding.onResponse(withdrawDummy());
  
        expect(bidding.currentPhase).toBe('play-bidding');
      });

      test('currentPlayer has advanced', () => {
        bidding.onResponse(withdrawDummy());

        expect(bidding.currentPlayer).toBe(nextPlayerDummy);
      });

      test('currentPlayer is biddingPlayersRound currentPlayer', () => {
        bidding.onResponse(withdrawDummy());

        expect(bidding.currentPlayer).toBe(playersMock.getCurrentPlayer());
      });

      test('players.currentPlayerWithdraws has been called', () => {
        bidding.onResponse(withdrawDummy());

        expect(playersMock.currentPlayerWithdraws).toHaveBeenCalled();
      });

      test('monstersPackAmount has not changed', () => {
        bidding.onResponse(withdrawDummy());
          
        expect(bidding.monstersPackAmount)
          .toBe(previousState.monstersPackAmount);
      });

      test('monstersInDungeon has not changed', () => {
        bidding.onResponse(withdrawDummy());
          
        expect(bidding.monstersInDungeonAmount)
          .toBe(previousState.monstersInDungeonAmount);
      });

      test('getActionRequestData can be called', () => {
        bidding.onResponse(withdrawDummy());

        expect(() => { bidding.getActionRequestData(); }).not.toThrowError();
      });

      test.each(buildAllResponseDummies())(
        'onResponse cannot be called with any BiddingActionResponse yet', 
        response => {
          bidding.onResponse(withdrawDummy());

          expect(() => { bidding.onResponse(response); })
            .toThrowError('A user action must be previously requested.');
        }
      );

      test('getResult cannot be called yet', () => {
        bidding.onResponse(withdrawDummy());

        expect(() => { bidding.getResult(); })
          .toThrowError('Bidding phase has not ended yet.');
      });

      test('bidding goes on', () => {
        bidding.onResponse(withdrawDummy());
          
        expect(bidding.goesOn()).toBeTrue();
      });

      test('getActionRequestData returns a play-bidding request', () => {
        bidding.onResponse(withdrawDummy());
        const request = bidding.getActionRequestData();
  
        expect(request)
          .toContainAllKeys(['action', 'player', 'content', 'state']);
        expect(request.action).toBe('play-bidding');
        expect(request.content).toBeUndefined();
        expect(request.state).toContainAllKeys([
          'dungeon', 'hero', 'remainingMonsters', 'remainingPlayers'
        ]);
      });
  
      test('getActionRequestData is targeted at next player', () => {
        bidding.onResponse(withdrawDummy());
        const target = bidding.getActionRequestData().player;

        expect(target).toBe(nextPlayerDummy);
      });
  
      test('getActionRequestData state reflects current bidding state', () => {
        bidding.onResponse(withdrawDummy());
        const state = bidding.getActionRequestData().state;
  
        expect(state.dungeon.length).toBe(bidding.monstersInDungeonAmount);
        expect(state.hero).toBe(heroMock);
        expect(state.remainingMonsters).toBe(bidding.monstersPackAmount);
        expect(state.remainingPlayers).toBe(playersMock.remainingPlayersAmount);
      });
      
      test('onResponse returns empty notification', () => {
        const notification = bidding.onResponse(withdrawDummy());

        expect(notification.notification).toBeUndefined();
      });
    });
  });

  describe('play-bidding accepted, add-monster action request demanded', () => {

    beforeEach(() => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
      bidding.getActionRequestData();
      bidding.onResponse(playBiddingDummy());
      previousState = getPublicState(bidding);
    });

    test('currentPhase has not changed', () => {
      bidding.getActionRequestData();

      expect(bidding.currentPhase).toBe(previousState.currentPhase);
    });

    test('currentPlayer has not changed', () => {
      bidding.getActionRequestData();

      expect(bidding.currentPlayer).toBe(previousState.currentPlayer);
    });

    test('currentPlayer is biddingPlayersRound currentPlayer', () => {
      bidding.getActionRequestData();

      expect(bidding.currentPlayer).toBe(playersMock.getCurrentPlayer());
    });

    test('bidding players have not changed', () => {
      bidding.getActionRequestData();

      expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
    });
    
    test('monstersPackAmount has not changed', () => {
      bidding.getActionRequestData();
        
      expect(bidding.monstersPackAmount).toBe(previousState.monstersPackAmount);
    });

    test('monstersInDungeon has not increased yet', () => {
      bidding.getActionRequestData();
        
      expect(bidding.monstersInDungeonAmount)
        .toBe(previousState.monstersInDungeonAmount);
    });
    
    test('getActionRequestData cannot be called right after', () => {
      bidding.getActionRequestData();

      expect(() => { bidding.getActionRequestData(); })
        .toThrowError('A user response to a previous request is pending.');
    });

    test.each([
      addMonsterDummy(), dontAddMonsterDummy()
    ])('onResponse can be called with MonsterAdditionResponse', response => {
      bidding.getActionRequestData();

       expect(() => { bidding.onResponse(response); }).not.toThrowError();
    });

    test.each([
      playBiddingDummy(), withdrawDummy(), removeEquipmentDummy()
    ])(
      'onResponse cannot be called with BidParticipation/EquipmentRemoval Response', 
      response => {
        bidding.getActionRequestData();
        
        expect(() => { bidding.onResponse(response); })
          .toThrowError('A response of "add-monster" type was expected.');
      }
    );

    test('getResult cannot be called', () => {
      bidding.getActionRequestData();

      expect(() => { bidding.getResult(); })
        .toThrowError('Bidding phase has not ended yet.');
    });

    test('bidding goes on', () => {
      bidding.getActionRequestData();

      expect(bidding.goesOn()).toBeTrue();
    });

    // return value of getActionRequestData already tested
  });

  describe('add-monster request accepted', () => {
    describe('1 monster left', () => {
      // SCENARIO (7) IN bidding.ts

      beforeEach(() => {
        monstersPackDummy = [ MonsterDouble.createDouble() ];
        [pickedMonster] = monstersPackDummy;
        bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
        bidding.getActionRequestData();
        bidding.onResponse(playBiddingDummy());
        bidding.getActionRequestData();
        previousState = getPublicState(bidding);
      });

      test('currentPhase is bidding-ended', () => {
        bidding.onResponse(addMonsterDummy());
  
        expect(bidding.currentPhase).toBe('bidding-ended');
      });

      test('currentPlayer is now null', () => {
        bidding.onResponse(addMonsterDummy());

        expect(bidding.currentPlayer).toBeNull();
      });

      test('players.currentPlayerWithdraws has not been called', () => {
        bidding.onResponse(addMonsterDummy());

        expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
      });

      test('monstersPackAmount has not changed', () => {
        bidding.onResponse(addMonsterDummy());
          
        expect(bidding.monstersPackAmount)
          .toBe(previousState.monstersPackAmount);
      });

      test('monstersInDungeon has increased by 1', () => {
        bidding.onResponse(addMonsterDummy());
          
        expect(bidding.monstersInDungeonAmount)
          .toBe(previousState.monstersInDungeonAmount + 1);
      });

      test('getActionRequestData cannot be called', () => {
        bidding.onResponse(addMonsterDummy());

        expect(() => { bidding.getActionRequestData(); })
          .toThrowError(
            'Bidding phase has ended, method should not have been called.'
          );
      });

      test.each(buildAllResponseDummies())(
        'onResponse cannot be called with any BiddingActionResponse anymore', 
        response => {
          bidding.onResponse(addMonsterDummy());
  
          expect(() => { bidding.onResponse(response); })
            .toThrowError(
              'Bidding phase has ended, method should not have been called.'
            );
        }
      );

      test('getResult can be called', () => {
        bidding.onResponse(addMonsterDummy());
  
        expect(() => { bidding.getResult(); }).not.toThrowError();
      });

      test('bidding has ended', () => {
        bidding.onResponse(addMonsterDummy());
          
        expect(bidding.goesOn()).toBeFalse();
      });

      test('onResponse returns empty notification', () => {
        const notification = bidding.onResponse(addMonsterDummy()).notification;

        expect(notification).toBeUndefined();
      });

      test('getResult returns expected reason and raid participants', () => {
        bidding.onResponse(addMonsterDummy());

        const result = bidding.getResult();
  
        expect(result.endReason).toBe('no-monsters');
        expect(result.raider).toBe(previousState.currentPlayer);
        expect(result.hero).toBe(heroMock);
        expect(result.enemies).toEqual([pickedMonster]);
      });
    });

    describe.each([2, 3, 4])('%i monsters left', monstersLeft => {
      // SCENARIO (6) IN bidding.ts

      beforeEach(() => {
        monstersPackDummy = [];
  
        for (let i = 0; i < monstersLeft; i++) {
          monstersPackDummy.push(MonsterDouble.createDouble());
        }
  
        pickedMonster = monstersPackDummy[monstersPackDummy.length - 1];
  
        bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
        bidding.getActionRequestData();
        bidding.onResponse(playBiddingDummy());
        bidding.getActionRequestData();
        previousState = getPublicState(bidding);
      });
  
      test('currentPhase is play-bidding', () => {
        bidding.onResponse(addMonsterDummy());
  
        expect(bidding.currentPhase).toBe('play-bidding');
      });
  
      test('currentPlayer has advanced', () => {
        bidding.onResponse(addMonsterDummy());
  
        expect(bidding.currentPlayer).toBe(nextPlayerDummy);
      });
  
      test('currentPlayer is biddingPlayersRound currentPlayer', () => {
        bidding.onResponse(addMonsterDummy());
  
        expect(bidding.currentPlayer).toBe(playersMock.getCurrentPlayer());
      });
  
      test('bidding players have not changed', () => {
        bidding.onResponse(addMonsterDummy());
  
        expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
      });
  
      test('monstersPackAmount has not changed', () => {
        bidding.onResponse(addMonsterDummy());
          
        expect(bidding.monstersPackAmount)
          .toBe(previousState.monstersPackAmount);
      });
  
      test('monstersInDungeon has increased by one', () => {
        bidding.onResponse(addMonsterDummy());
          
        expect(bidding.monstersInDungeonAmount)
          .toBe(previousState.monstersInDungeonAmount + 1);
      });
  
      test('getActionRequestData can be called', () => {
        bidding.onResponse(addMonsterDummy());
          
        expect(() => { bidding.getActionRequestData(); }).not.toThrowError();
      });
  
      test.each(buildAllResponseDummies())(
        'onResponse cannot be called with any BiddingActionResponse yet', 
        response => {
          bidding.onResponse(addMonsterDummy());
  
          expect(() => { bidding.onResponse(response); })
            .toThrowError('A user action must be previously requested.');
        }
      );
  
      test('getResult cannot be called yet', () => {
        bidding.onResponse(addMonsterDummy());
  
        expect(() => { bidding.getResult(); })
          .toThrowError('Bidding phase has not ended yet.');
      });
  
      test('bidding goes on', () => {
        bidding.onResponse(addMonsterDummy());
          
        expect(bidding.goesOn()).toBeTrue();
      });
  
      test('getActionRequestData returns a play-bidding request', () => {
        bidding.onResponse(addMonsterDummy());
        const request = bidding.getActionRequestData();
  
        expect(request)
          .toContainAllKeys(['action', 'player', 'content', 'state']);
        expect(request.action).toBe('play-bidding');
        expect(request.content).toBeUndefined();
        expect(request.state).toContainAllKeys([
          'dungeon', 'hero', 'remainingMonsters', 'remainingPlayers'
        ]);
      });
  
      test('getActionRequestData is targeted at next player', () => {
        bidding.onResponse(addMonsterDummy());
        const target = bidding.getActionRequestData().player;

        expect(target).toBe(nextPlayerDummy);
      });
  
      test('getActionRequestData state reflects current bidding state', () => {
        bidding.onResponse(addMonsterDummy());
        const state = bidding.getActionRequestData().state;
  
        expect(state.dungeon.length).toBe(bidding.monstersInDungeonAmount);
        expect(state.hero).toBe(heroMock);
        expect(state.remainingMonsters).toBe(bidding.monstersPackAmount);
        expect(state.remainingPlayers).toBe(playersMock.remainingPlayersAmount);
      });
      
      test('onResponse returns empty notification', () => {
        const notification = bidding.onResponse(addMonsterDummy());
  
        expect(notification.notification).toBeUndefined();
      });
    });
  });

  describe('add-monster request rejected', () => {
    // SCENARIO (8) IN bidding.ts

    beforeEach(() => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
      bidding.getActionRequestData();
      bidding.onResponse(playBiddingDummy());
      bidding.getActionRequestData();
      previousState = getPublicState(bidding);
    });

    test('currentPhase is remove-equipment', () => {
      bidding.onResponse(dontAddMonsterDummy());

      expect(bidding.currentPhase).toBe('remove-equipment');
    });

    test('currentPlayer has not changed', () => {
      bidding.onResponse(dontAddMonsterDummy());

      expect(bidding.currentPlayer).toBe(previousState.currentPlayer);
    });

    test('currentPlayer is biddingPlayersRound currentPlayer', () => {
      bidding.onResponse(dontAddMonsterDummy());

      expect(bidding.currentPlayer).toBe(playersMock.getCurrentPlayer());
    });

    test('bidding players have not changed', () => {
      bidding.onResponse(dontAddMonsterDummy());

      expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
    });
    
    test('monstersPackAmount has not decreased', () => {
      bidding.onResponse(dontAddMonsterDummy());
        
      expect(bidding.monstersPackAmount)
        .toBe(previousState.monstersPackAmount);
    });

    test('monstersInDungeon has not increased', () => {
      bidding.onResponse(dontAddMonsterDummy());
        
      expect(bidding.monstersInDungeonAmount)
        .toBe(previousState.monstersInDungeonAmount);
    });

    test('getActionRequestData can be called', () => {
      bidding.onResponse(dontAddMonsterDummy());

      expect(() => { bidding.getActionRequestData(); }).not.toThrowError();
    });

    test.each(buildAllResponseDummies())(
      'onResponse cannot be called with any BiddingActionResponse yet', 
      response => {
        bidding.onResponse(dontAddMonsterDummy());

        expect(() => { bidding.onResponse(response); })
          .toThrowError('A user action must be previously requested.');
      }
    );

    test('getResult cannot be called', () => {
      bidding.onResponse(dontAddMonsterDummy());

      expect(() => { bidding.getResult(); })
        .toThrowError('Bidding phase has not ended yet.');
    });

    test('bidding goes on', () => {
      bidding.onResponse(dontAddMonsterDummy());
        
      expect(bidding.goesOn()).toBeTrue();
    });

    test('getActionRequestData returns a remove-equipment request', () => {
      bidding.onResponse(dontAddMonsterDummy());
      const request = bidding.getActionRequestData();

      expect(request)
        .toContainAllKeys(['action', 'player', 'content', 'state']);
      expect(request.action).toBe('remove-equipment');
      expect(request.content).toBeDefined();
      expect(request.state).toContainAllKeys([
        'dungeon', 'hero', 'remainingMonsters', 'remainingPlayers'
      ]);
    });

    test('getActionRequestData is targeted at current player', () => {
      bidding.onResponse(dontAddMonsterDummy());
      const request = bidding.getActionRequestData();

      expect(request.player).toBe(previousState.currentPlayer);
    });

    test('getActionRequestData content is hero\'s equipment', () => {
      bidding.onResponse(dontAddMonsterDummy());
      const request = bidding.getActionRequestData();

      expect(request.content).toIncludeSameMembers(equipmentOptions);
    });

    test('getActionRequestData state reflects current bidding state', () => {
      bidding.onResponse(dontAddMonsterDummy());
      const state = bidding.getActionRequestData().state;

      expect(state.dungeon.length).toBe(bidding.monstersInDungeonAmount);
      expect(state.hero).toBe(heroMock);
      expect(state.remainingMonsters).toBe(bidding.monstersPackAmount);
      expect(state.remainingPlayers).toBe(playersMock.remainingPlayersAmount);
    });

    test('onResponse returns empty notification', () => {
      const notification = bidding.onResponse(dontAddMonsterDummy());

      expect(notification.notification).toBeUndefined();
    });
  });

  describe('add-monster rejected, remove-equipment action request demanded', () => {
    beforeEach(() => {
      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
      bidding.getActionRequestData();
      bidding.onResponse(playBiddingDummy());
      bidding.getActionRequestData();
      bidding.onResponse(dontAddMonsterDummy());
      previousState = getPublicState(bidding);
    });

    test('currentPhase has not changed', () => {
      bidding.getActionRequestData();

      expect(bidding.currentPhase).toBe(previousState.currentPhase);
    });

    test('currentPlayer has not changed', () => {
      bidding.getActionRequestData();

      expect(bidding.currentPlayer).toBe(previousState.currentPlayer);
    });

    test('currentPlayer is biddingPlayersRound currentPlayer', () => {
      bidding.getActionRequestData();

      expect(bidding.currentPlayer).toBe(playersMock.getCurrentPlayer());
    });

    test('bidding players have not changed', () => {
      bidding.getActionRequestData();

      expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
    });
    
    test('monstersPackAmount has not decreased', () => {
      bidding.getActionRequestData();
        
      expect(bidding.monstersPackAmount).toBe(previousState.monstersPackAmount);
    });

    test('monstersInDungeon has not increased', () => {
      bidding.getActionRequestData();
        
      expect(bidding.monstersInDungeonAmount)
        .toBe(previousState.monstersInDungeonAmount);
    });
    
    test('getActionRequestData cannot be called right after', () => {
      bidding.getActionRequestData();

      expect(() => { bidding.getActionRequestData(); })
        .toThrowError('A user response to a previous request is pending.');
    });

    test.each([
      playBiddingDummy(), withdrawDummy(), 
      addMonsterDummy(), dontAddMonsterDummy(),
    ])(
      'onResponse cannot be called with PlayBidding/MonsterAddition Response', 
        response => {
        bidding.getActionRequestData();
        
        expect(() => { bidding.onResponse(response); })
          .toThrowError('A response of "remove-equipment" type was expected.');
      }
    );

    test('onResponse can be called with EquipmentRemoval Response', () => {
      bidding.getActionRequestData();
        
      expect(() => { bidding.onResponse(removeEquipmentDummy()); })
        .not.toThrowError();
    });

    test('getResult cannot be called', () => {
      bidding.getActionRequestData();

      expect(() => { bidding.getResult(); })
        .toThrowError('Bidding phase has not ended yet.');
    });

    test('bidding goes on', () => {
      bidding.getActionRequestData();

      expect(bidding.goesOn()).toBeTrue();
    });

    // return value of getActionRequestData already tested
  });

  describe('remove equipment response', () => {
    describe.each([
      1, 2, 3
    ])('1 monster left, %i equipment left', equipmentLeft => {
      // SCENARIO (10) IN bidding.ts

      beforeEach(() => {
        equipmentOptions = pickRandomEquipmentNames(equipmentLeft);
        
        jest.spyOn(heroMock, 'getMountedEquipment')
          .mockReturnValue(equipmentOptions);

        monstersPackDummy = [ MonsterDouble.createDouble() ];
        bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
        bidding.getActionRequestData();
        bidding.onResponse(playBiddingDummy());
        bidding.getActionRequestData();
        bidding.onResponse(dontAddMonsterDummy());
        bidding.getActionRequestData();
        previousState = getPublicState(bidding);
      });

      test('currentPhase is bidding-ended', () => {
        bidding.onResponse(removeEquipmentDummy());
  
        expect(bidding.currentPhase).toBe('bidding-ended');
      });

      test('currentPlayer is now null', () => {
        bidding.onResponse(removeEquipmentDummy());

        expect(bidding.currentPlayer).toBeNull();
      });

      test('players.currentPlayerWithdraws has not been called', () => {
        bidding.onResponse(removeEquipmentDummy());

        expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
      });

      test('monstersPackAmount has not changed', () => {
        bidding.onResponse(removeEquipmentDummy());
          
        expect(bidding.monstersPackAmount)
          .toBe(previousState.monstersPackAmount);
      });

      test('monstersInDungeon has not changed', () => {
        bidding.onResponse(removeEquipmentDummy());
          
        expect(bidding.monstersInDungeonAmount)
          .toBe(previousState.monstersInDungeonAmount);
      });

      test('it calls hero.discardEquipmentPiece with chosen equipment', () => {
        jest.spyOn(heroMock, 'discardEquipmentPiece');

        const response = removeEquipmentDummy();
        const chosenEquipment = response.content;
        bidding.onResponse(response);

        expect(heroMock.discardEquipmentPiece)
          .toHaveBeenCalledWith(chosenEquipment);
      });

      test('getActionRequestData cannot be called', () => {
        bidding.onResponse(removeEquipmentDummy());

        expect(() => { bidding.getActionRequestData(); })
          .toThrowError(
            'Bidding phase has ended, method should not have been called.'
          );
      });

      test.each(buildAllResponseDummies())(
        'onResponse cannot be called with any BiddingActionResponse anymore', 
        response => {
          bidding.onResponse(removeEquipmentDummy());
  
          expect(() => { bidding.onResponse(response); })
            .toThrowError(
              'Bidding phase has ended, method should not have been called.'
            );
        }
      );

      test('getResult can be called', () => {
        bidding.onResponse(removeEquipmentDummy());
  
        expect(() => { bidding.getResult(); }).not.toThrowError();
      });

      test('bidding has ended', () => {
        bidding.onResponse(removeEquipmentDummy());
          
        expect(bidding.goesOn()).toBeFalse();
      });

      test('onResponse returns empty notification', () => {
        const notification = bidding.onResponse(removeEquipmentDummy());

        expect(notification.notification).toBeUndefined();
      });

      test('getResult returns expected reason and raid participants', () => {
        bidding.onResponse(removeEquipmentDummy());

        const result = bidding.getResult();
        
        expect(result.endReason).toBe('no-monsters');
        expect(result.raider).toBe(previousState.currentPlayer);
        expect(result.hero).toBe(heroMock);
        expect(result.enemies).toBeArrayOfSize(0);
      });
    })

    describe.each([
      [2, 1], [2, 2], [2, 3],
      [3, 1], [3, 2], [3, 3],
      [4, 1], [4, 2], [4, 3],
    ])('%i monsters left, %i equipment left', (monstersLeft, equipmentLeft) => {
      // SCENARIO (9) IN bidding.ts

      beforeEach(() => {
        equipmentOptions = pickRandomEquipmentNames(equipmentLeft);
        
        jest.spyOn(heroMock, 'getMountedEquipment')
          .mockReturnValue(equipmentOptions);
        
        jest.spyOn(heroMock, 'discardEquipmentPiece')
          .mockImplementation((piece: EquipmentName) => {
            const newOptions = equipmentOptions.slice(1);
            
            jest.spyOn(heroMock, 'getMountedEquipment')
              .mockReturnValue(newOptions);
          });

        monstersPackDummy = [];

        for (let i = 0; i < monstersLeft; i++) {
          monstersPackDummy.push(MonsterDouble.createDouble());
        }

        pickedMonster = monstersPackDummy[monstersPackDummy.length - 1];
        bidding = new Bidding(playersMock, heroMock, monstersPackDummy);
        bidding.getActionRequestData();
        bidding.onResponse(playBiddingDummy());
        bidding.getActionRequestData();
        bidding.onResponse(dontAddMonsterDummy());
        bidding.getActionRequestData();
        previousState = getPublicState(bidding);
      });

      test('currentPhase is play-bidding', () => {
        bidding.onResponse(removeEquipmentDummy());
  
        expect(bidding.currentPhase).toBe('play-bidding');
      });
  
      test('currentPlayer has advanced', () => {
        bidding.onResponse(removeEquipmentDummy());
  
        expect(bidding.currentPlayer).toBe(nextPlayerDummy);
      });
  
      test('currentPlayer is biddingPlayersRound currentPlayer', () => {
        bidding.onResponse(removeEquipmentDummy());
  
        expect(bidding.currentPlayer).toBe(playersMock.getCurrentPlayer());
      });
  
      test('bidding players have not changed', () => {
        bidding.onResponse(removeEquipmentDummy());
  
        expect(playersMock.currentPlayerWithdraws).not.toHaveBeenCalled();
      });
  
      test('monstersPackAmount has not changed', () => {
        bidding.onResponse(removeEquipmentDummy());
          
        expect(bidding.monstersPackAmount)
          .toBe(previousState.monstersPackAmount);
      });
  
      test('monstersInDungeon has not changed', () => {
        bidding.onResponse(removeEquipmentDummy());
          
        expect(bidding.monstersInDungeonAmount)
          .toBe(previousState.monstersInDungeonAmount);
      });

      test('it calls hero.discardEquipmentPiece with chosen equipment', () => {
        const response = removeEquipmentDummy();
        const chosenEquipment = response.content;
        bidding.onResponse(response);

        expect(heroMock.discardEquipmentPiece)
          .toHaveBeenCalledWith(chosenEquipment);
      });
  
      test('getActionRequestData can be called', () => {
        bidding.onResponse(removeEquipmentDummy());
          
        expect(() => { bidding.getActionRequestData(); }).not.toThrowError();
      });
  
      test.each(buildAllResponseDummies())(
        'onResponse cannot be called with any BiddingActionResponse yet', 
        response => {
          bidding.onResponse(removeEquipmentDummy());
  
          expect(() => { bidding.onResponse(response); })
            .toThrowError('A user action must be previously requested.');
        }
      );
  
      test('getResult cannot be called yet', () => {
        bidding.onResponse(removeEquipmentDummy());
  
        expect(() => { bidding.getResult(); })
          .toThrowError('Bidding phase has not ended yet.');
      });
  
      test('bidding goes on', () => {
        bidding.onResponse(removeEquipmentDummy());
          
        expect(bidding.goesOn()).toBeTrue();
      });
  
      test('getActionRequestData returns a play-bidding request', () => {
        bidding.onResponse(removeEquipmentDummy());
        const request = bidding.getActionRequestData();
  
        expect(request)
          .toContainAllKeys(['action', 'player', 'content', 'state']);
        expect(request.action).toBe('play-bidding');
        expect(request.content).toBeUndefined();
        expect(request.state).toContainAllKeys([
          'dungeon', 'hero', 'remainingMonsters', 'remainingPlayers'
        ]);
      });
  
      test('getActionRequestData is targeted at next player', () => {
        bidding.onResponse(removeEquipmentDummy());
        const target = bidding.getActionRequestData().player;

        expect(target).toBe(nextPlayerDummy);
      });
  
      test('getActionRequestData state reflects current bidding state', () => {
        bidding.onResponse(removeEquipmentDummy());
        const state = bidding.getActionRequestData().state;
  
        expect(state.dungeon.length).toBe(bidding.monstersInDungeonAmount);
        expect(state.hero).toBe(heroMock);
        expect(state.remainingMonsters).toBe(bidding.monstersPackAmount);
        expect(state.remainingPlayers).toBe(playersMock.remainingPlayersAmount);
      });
      
      test('onResponse returns empty notification', () => {
        const notification = bidding.onResponse(removeEquipmentDummy());
  
        expect(notification.notification).toBeUndefined();
      });
    });
  });

  describe('monster addition (amount and order)', () => {
    let rounds: number;
    let initialPackAmount: number;
    let additionSignals: boolean[];
    let addedMonsters: MonsterType[];

    beforeEach(() => {
      rounds = 8;
      initialPackAmount = rounds + randomInteger(5);
    
      monstersPackDummy = [];
      additionSignals = [];
      addedMonsters = [];

      for (let i = 0; i < initialPackAmount; i++) {
        monstersPackDummy.push(MonsterDouble.createDouble());
        if (i < rounds) additionSignals.push(Math.random() >= 0.5);
      }

      bidding = new Bidding(playersMock, heroMock, Array.from(monstersPackDummy));

      for (let i = 0; i < rounds; i++) {
        const addMonster = additionSignals[i];
        bidding.getActionRequestData();
        bidding.onResponse(playBiddingDummy());
        const request = bidding.getActionRequestData();
        bidding.onResponse({ action: 'add-monster', content: addMonster });
        
        if (addMonster) {
          if (request.action !== 'add-monster') {
            throw new Error('Unexpected request type');
          }

          addedMonsters.push(request.content);
        } else {
          bidding.getActionRequestData();
          bidding.onResponse(removeEquipmentDummy());
        }
      }

      while (bidding.goesOn()) {
        bidding.getActionRequestData();
        bidding.onResponse(withdrawDummy());
      }
    });
    
    test('set up works', () => {
      const expectedRemainingMonsters = initialPackAmount - rounds;
      const expectedAddedMonsters = additionSignals
        .filter(signal => signal).length;

      expect(bidding.monstersPackAmount).toBe(expectedRemainingMonsters);
      expect(addedMonsters.length).toBe(expectedAddedMonsters);
    });

    test('monsters in dungeon amount equals additions', () => {  
      expect(bidding.monstersInDungeonAmount).toBe(addedMonsters.length);
    });

    test('returned dungeon contains added monsters in reverse order', () => {
      const dungeonOutcome = bidding.getResult().enemies
        .map(enemy => enemy.type);

      expect(dungeonOutcome).toEqual(addedMonsters.reverse());
    })
  });

  describe('equipment removal (amount and order)', () => {
    let initialEquipmentSize: number;
    let rounds: number;
    let removals: boolean[];
    let removedEquipment: EquipmentName[];
    let expectedRemovals: EquipmentName[];

    beforeEach(() => {
      initialEquipmentSize = 10;
      equipmentOptions = pickRandomEquipmentNames(initialEquipmentSize, true);
      rounds = 8;
      monstersPackDummy = [];
      removals = [];
      removedEquipment = [];
      expectedRemovals = [];
      
      for (let i = 0; i < rounds; i++) {
        monstersPackDummy.push(MonsterDouble.createDouble());
        removals.push(Math.random() >= 0.5);
      }

      jest.spyOn(heroMock, 'discardEquipmentPiece')
        .mockImplementation((piece: EquipmentName) => {
          removedEquipment.push(piece);
        });

      bidding = new Bidding(playersMock, heroMock, monstersPackDummy);

      for (let i = 0; i < rounds; i++) {
        bidding.getActionRequestData();
        bidding.onResponse(playBiddingDummy());
        bidding.getActionRequestData();

        if (!removals[i]) {
          bidding.onResponse(addMonsterDummy());
        } else {
          bidding.onResponse(dontAddMonsterDummy());
          bidding.getActionRequestData();
          const response = removeEquipmentDummy();
          expectedRemovals.push(response.content);
          bidding.onResponse(response);
        }
      }

      while (bidding.goesOn()) {
        bidding.getActionRequestData();
        bidding.onResponse(withdrawDummy());
      }
    });

    test('removed equipment length equals programmed removals', () => {
      const removalsAmount = removals.filter(removal => removal).length;
      
      expect(removedEquipment.length).toBe(removalsAmount);
    });

    test('removed equipment contains expected pieces in expected order', () => {
      expect(removedEquipment).toEqual(expectedRemovals);
    })
  });
});
