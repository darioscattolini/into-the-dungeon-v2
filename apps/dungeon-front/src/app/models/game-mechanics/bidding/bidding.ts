import { BiddingPlayersRound } from './bidding-players-round';
import { BiddingState } from './bidding-state';
import {
  BiddingAction,
  BiddingActionRequestData,
  BiddingActionResponseContent,
  BiddingResponseNotificationData
} from './bidding-action';
import { BiddingEndReason, BiddingResult } from './bidding-result';
import { Player, Hero, EquipmentName, AnyMonster } from '../../models';

type DungeonEntry = {
  monster: AnyMonster;
  adder: Player;
}

export class Bidding {
  /* 
    Public getters added to simplify testing. This API should not be used by the
    app itself. Relevant state information is sent through BiddingActionRequest
  */

  public get currentPhase() {
    if (this.hasEnded) return 'bidding-ended';
    else return this.currentAction;
  }

  public get currentPlayer(): Player | null {
    if (!this.hasEnded) return this.players.getCurrentPlayer();
    else return null;
  }

  public get monstersInDungeonAmount(): number {
    return this.monstersInDungeon.length;
  }

  public get monstersPackAmount(): number {
    return this.monstersPack.length;
  }

  private endReason?: BiddingEndReason;
  private hasEnded = false;
  private currentAction: BiddingAction = 'play-bidding';
  private hero: Hero;
  private monstersInDungeon: DungeonEntry[] = [];
  private monstersPack: AnyMonster[];
  private pickedMonster: AnyMonster | undefined;
  private players: BiddingPlayersRound;
  private raider?: Player;
  private responsePending = false;
  
  constructor(players: BiddingPlayersRound, hero: Hero, monsters: AnyMonster[]) {
    this.players = players;
    this.hero = hero;
    this.monstersPack = monsters;
  }

  public getActionRequestData(): BiddingActionRequestData {
    if (this.responsePending) {
      throw new Error('A user response to a previous request is pending.');
    }

    if (this.hasEnded) {
      throw new Error(
        'Bidding phase has ended, method should not have been called.'
      );
    }

    const action = this.currentAction;
    const player = this.players.getCurrentPlayer();
    const state = this.getExposableState();

    this.responsePending = true;

    if (action === 'add-monster') {
      if (!this.pickedMonster) throw new Error('No picked monster.');

      const content = this.pickedMonster.type;
      
      return { action, player, content, state };
    } else if (action === 'remove-equipment') {
      const content = this.getRemovableEquipment();
      
      return { action, player, content, state };
    } else {
      const content = undefined;
      
      return { action, player, state, content };
    }
  }

  public getResult(): BiddingResult {
    if (!this.hasEnded) throw new Error ('Bidding phase has not ended yet.');
    if (!this.raider) throw new Error ('Raider has not been declared.');
    if (!this.endReason) throw new Error ('End reason has not been stated.');
  
    return {
      endReason: this.endReason,
      raider: this.raider,
      hero: this.hero,
      enemies: this.getDungeonDataForRaid()
    }
  }

  public goesOn(): boolean {
    return !this.hasEnded;
  }

  public onResponse(
    response: BiddingActionResponseContent
  ): BiddingResponseNotificationData {
    if (this.hasEnded) {
      throw new Error(
        'Bidding phase has ended, method should not have been called.'
      );
    }
    
    if (!this.responsePending) {
      throw new Error('A user action must be previously requested.');
    }

    if (response.action !== this.currentAction) {
      throw new Error(`A response of "${this.currentAction}" type was expected.`);
    }

    let outcome: BiddingResponseNotificationData;

    switch (response.action) {
      case 'play-bidding':
        outcome = this.managePlayBiddingResponse(response.content);
        break; 
      case 'add-monster':
        outcome = this.manageMonsterAdditionResponse(response.content);
        break;
      case 'remove-equipment':
        outcome = this.manageRemoveEquipmentResponse(response.content);
        break;
    }

    this.responsePending = false;
    return outcome;
  }

  private addPickedMonsterToDungeon(): void {
    if (!this.pickedMonster) {
      throw new Error ('There is no picked monster to add to dungeon.')
    }

    if (!this.currentPlayer) {
      throw new Error ('There is no active player, bidding should have ended.')
    }

    this.monstersInDungeon.unshift({
      monster: this.pickedMonster,
      adder: this.currentPlayer
    });

    this.pickedMonster = undefined;
  }

  private endTurn(): void {
    if (this.players.remainingPlayersAmount === 1) {
      // SCENARIO (5) (see below)
      this.hasEnded = true;
      this.endReason = 'last-bidding-player';
      this.raider = this.players.getLastBiddingPlayer();
    } else if (this.monstersPack.length === 0) {
      // SCENARIOS (2), (7) and (10) (see below)
      this.hasEnded = true;
      this.endReason = 'no-monsters';
      this.raider = this.players.getCurrentPlayer();
    } else {
      // SCENARIOS (1), (4), (6) and (9) (see below)
      this.players.advanceToNextPlayer();
      this.currentAction = 'play-bidding';
    }
  }

  private getDungeonDataForRaid(): AnyMonster[] {
    return this.monstersInDungeon.map(entry => entry.monster);
  }

  private getExposableState(): BiddingState {
    const dungeon: BiddingState['dungeon'] = this.monstersInDungeon.map(
      entry => entry.adder === this.currentPlayer 
        ? entry.monster.type 
        : 'secret'
    );

    const hero: BiddingState['hero'] = this.hero;

    const remainingPlayers: BiddingState['remainingPlayers'] 
      = this.players.remainingPlayersAmount;
    
    const remainingMonsters: BiddingState['remainingMonsters'] 
      = this.monstersPackAmount;

    return { dungeon, hero, remainingMonsters, remainingPlayers };
  }

  private getRemovableEquipment(): EquipmentName[] {
    return this.hero.getMountedEquipment();
  }

  private manageMonsterAdditionResponse(
    response: boolean
  ): BiddingResponseNotificationData {
    const pickedMonster = this.pickedMonster;

    if (!pickedMonster) {
      throw new Error('Expected pickedMonster property to be defined.');
    }
    
    if (response) {
      // SCENARIOS (6) and (7) (see below)
      this.addPickedMonsterToDungeon();
      this.endTurn();
    } else {
      // SCENARIO (8) (see below)
      this.currentAction = 'remove-equipment';
    }

    return {};
  }

  private managePlayBiddingResponse(
    response: boolean
  ): BiddingResponseNotificationData {
    if (response) {
      this.pickCurrentMonster();

      if (this.getRemovableEquipment().length === 0) {
        // SCENARIOS (1) AND (2) (see below)
        const pickedMonster = this.pickedMonster as AnyMonster;
        const notification: BiddingResponseNotificationData['notification'] = {
          player: this.players.getCurrentPlayer(),
          forciblyAddedMonster: pickedMonster.type
        }

        this.addPickedMonsterToDungeon();
        this.endTurn();

        return { notification };
      } else {
        // SCENARIO (3) (see below)
        this.currentAction = 'add-monster';
      }
    } else {
      // SCENARIOS (4) AND (5) (see below)
      this.players.currentPlayerWithdraws();
      this.endTurn();
    }

    return {};
  }

  private manageRemoveEquipmentResponse(
    equipment: EquipmentName
  ): BiddingResponseNotificationData {
    if (this.getRemovableEquipment().length === 0) {
      throw new Error('Hero has no equipment, method should not have been called.');
    }

    // SCENARIOS (9) AND (10) (see below)
    this.hero.discardEquipmentPiece(equipment);
    this.endTurn();

    return {};
  }

  private pickCurrentMonster(): void {
    if (this.monstersPack.length === 0) {
      throw new Error('There are no monsters in pack, bidding should have ended.');
    }

    this.pickedMonster = this.monstersPack.pop() as AnyMonster;
  }
}

/*
  ALL POSSIBLE RESPONSE SCENARIOS:

  (1)
  * Bidding accepted
  * 0 equipment left: monster forcibly added in dungeon
  * >0 monsters left: current player's turn ends, it's next player's turn
  
  (2)
  * Bidding accepted
  * 0 equipment left: monster forcibly added in dungeon
  * 0 monsters left: bidding ends, current player is raider
  
  (3)
  * Bidding accepted
  * >0 equipment left: current player's turn continues
 
  (4)
  * Bidding rejected
  * >1 players left: it's next player's turn
  
  (5)
  * Bidding rejected
  * 1 player left: bidding ends, next player is raider
   
  (6) 
  * Add monster accepted
  * >0 monsters left: current player's turn ends, it's next player's turn
  
  (7)
  * Add monster accepted
  * 0 monsters left: bidding ends, current player is raider
  
  (8)
  * Add monster rejected: current player's turn continues

  (9)
  * Equipment removed
  * >0 monsters left: current player's turn ends, it's next player's turn

  (10)
  * Equipment removed
  * 0 monsters left: bidding ends, current player is raider
*/
