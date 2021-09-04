import { BiddingPlayersRound } from './bidding-players-round';
import { 
  BiddingAction, BiddingActionRequest, BiddingActionResponse, 
  BiddingExposableState, 
} from './bidding-action';
import { BiddingNotification } from './bidding-notification';
import {
  Player, Hero, EquipmentName, AnyMonster, MonsterType, RaidParticipants 
} from '../../models';

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

  private hasEnded = false;
  private currentAction: BiddingAction = 'play-bidding';
  private hero: Hero;
  private monstersInDungeon: DungeonEntry[] = [];
  private monstersPack: AnyMonster[];
  private pickedMonster: AnyMonster | undefined;
  private players: BiddingPlayersRound;
  private responsePending = false;
  
  constructor(players: BiddingPlayersRound, hero: Hero, monsters: AnyMonster[]) {
    this.players = players;
    this.hero = hero;
    this.monstersPack = monsters;
  }

  public getActionRequest(): BiddingActionRequest {
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

  public getResult(): RaidParticipants {
    if (!this.hasEnded) throw new Error ('Bidding phase has not ended yet.');
  
    return {
      raider: this.players.getRaider(),
      hero: this.hero,
      enemies: this.getDungeonDataForRaid()
    }
  }

  public goesOn(): boolean {
    return !this.hasEnded;
  }

  public onResponse(response: BiddingActionResponse): BiddingNotification {
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

    let outcome: BiddingNotification;

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

  private endTurn(): Player {
    const nextPlayer = this.players.advanceToNextPlayer();
    this.currentAction = 'play-bidding';  

    return nextPlayer;
  }

  private getDungeonDataForRaid(): AnyMonster[] {
    return this.monstersInDungeon.map(entry => entry.monster);
  }

  private getExposableState(): BiddingExposableState {
    const dungeon = this.monstersInDungeon.map(
      entry => entry.adder === this.currentPlayer 
        ? entry.monster.type 
        : 'unknown'
    );
    const hero = {
      type: this.hero.type,
      equipment: this.hero.getMountedEquipment()
    };
    const remainingPlayers = this.players.remainingPlayersAmount;
    const remainingMonsters = this.monstersPackAmount;

    return { dungeon, hero, remainingMonsters, remainingPlayers };
  }

  private getRemovableEquipment(): EquipmentName[] {
    return this.hero.getMountedEquipment();
  }

  private manageMonsterAdditionResponse(response: boolean): BiddingNotification {
    let notification: BiddingNotification;
    const pickedMonster = this.pickedMonster;
    const target = this.players.getCurrentPlayer();

    if (!pickedMonster) {
      throw new Error('Expected pickedMonster property to be defined.');
    }
    
    if (response) {
      const message = 'monster-added';
      const entity = pickedMonster.type;
      this.addPickedMonsterToDungeon();
      const nextPlayer = this.endTurn();
      
      if (this.monstersPack.length >= 1) {
        const lastMonster = this.monstersPack.length === 1;
        
        notification = {
          target,
          message,
          entity,
          endOfTurn: {
            nextPlayer,
            warnings: {
              noEquipment: false,
              lastMonster
            }
          },
          endOfBidding: undefined
        };
      } else {
        this.hasEnded = true;
        this.players.declareCurrentPlayerRaider();
        const raider = this.players.getRaider();
        
        notification = {
          target, 
          message, 
          entity,
          endOfBidding: {
            raider,
            reason: 'last-monster'
          },
          endOfTurn: undefined
        };
      }
    } else {
      this.currentAction = 'remove-equipment';

      notification = {
        target,
        message: 'no-monster-added',
        entity: undefined,
        endOfTurn: undefined,
        endOfBidding: undefined
      };
    }

    return notification;
  }

  private managePlayBiddingResponse(response: boolean): BiddingNotification {
    let notification: BiddingNotification;
    const target = this.players.getCurrentPlayer();

    if (response) {
      const pickedMonster = this.pickCurrentMonster();

      if (this.getRemovableEquipment().length === 0) {
        const message = 'necessarily-add-monster';
        this.addPickedMonsterToDungeon();
        
        if (this.monstersPack.length === 0) {
          this.hasEnded = true;
          this.players.declareCurrentPlayerRaider();
          const raider = this.players.getRaider();
          
          notification = {
            target, 
            message, 
            entity: pickedMonster,
            endOfBidding: {
              raider,
              reason: 'last-monster'
            },
            endOfTurn: undefined
          };
        } else {
          const nextPlayer = this.endTurn();
          const lastMonster = this.monstersPack.length === 1;

          notification = {
            target, 
            message, 
            entity: pickedMonster,
            endOfBidding: undefined,
            endOfTurn: {
              nextPlayer,
              warnings: {
                lastMonster,
                noEquipment: false
              }
            }
          };
        }
      } else {
        this.currentAction = 'add-monster';

        notification = {
          target, 
          message: 'monster-equipment-choice', 
          entity: undefined,
          endOfBidding: undefined,
          endOfTurn: undefined
        };
      }
    } else {
      const message = 'bidding-withdrawal';
      this.players.currentPlayerWithdraws();

      if (this.players.remainingPlayersAmount > 1) {
        const nextPlayer = this.endTurn();

        notification = {
          target, 
          message, 
          entity: undefined,
          endOfBidding: undefined,
          endOfTurn: {
            nextPlayer,
            warnings: {
              lastMonster: false,
              noEquipment: false
            }
          }
        };
      } else {
        this.hasEnded = true;
        const raider = this.players.getRaider();

        notification = {
          target, 
          message, 
          entity: undefined,
          endOfBidding: {
            raider,
            reason: 'last-bidder'
          },
          endOfTurn: undefined
        };
      }
    }

    return notification;
  }

  private manageRemoveEquipmentResponse(
    equipment: EquipmentName
  ): BiddingNotification {
    if (this.getRemovableEquipment().length === 0) {
      throw new Error('Hero has no equipment, method should not have been called.');
    }

    let notification: BiddingNotification;

    this.hero.discardEquipmentPiece(equipment);

    const target = this.players.getCurrentPlayer();
    const message = 'equipment-removed';
    const entity = equipment;

    if (this.monstersPack.length > 0) {
      const nextPlayer = this.endTurn();
      const noEquipment = this.getRemovableEquipment().length === 0;
      const lastMonster = this.monstersPack.length === 1;

      notification = {
        target,
        message,
        entity,
        endOfTurn: {
          nextPlayer,
          warnings: {
            noEquipment,
            lastMonster
          }
        },
        endOfBidding: undefined
      };
    } else {
      this.hasEnded = true;
      this.players.declareCurrentPlayerRaider();
      const raider = this.players.getRaider();
      
      notification = {
        target, 
        message, 
        entity,
        endOfBidding: {
          raider,
          reason: 'last-monster'
        },
        endOfTurn: undefined
      };
    }

    return notification;
  }

  private pickCurrentMonster(): MonsterType {
    if (this.monstersPack.length === 0) {
      throw new Error('There are no monsters in pack, bidding should have ended.');
    }

    const pickedMonster = this.monstersPack.pop() as AnyMonster;
    this.pickedMonster = pickedMonster;

    return pickedMonster.type;
  }
}
