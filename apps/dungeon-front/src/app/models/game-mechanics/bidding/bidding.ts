import { BiddingPlayersRound } from './bidding-players-round';
import { 
  BiddingAction, BiddingActionRequest, BiddingActionResponse 
} from './bidding-action';
import { BiddingNotification } from './bidding-notification';
import {
  Player, Hero, EquipmentName, Monster, MonsterType, RaidParticipants 
} from '../../models';

export class Bidding {
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
  private monstersInDungeon: Monster[] = [];
  private monstersPack: Monster[];
  private pickedMonster: Monster | undefined;
  private players: BiddingPlayersRound;
  private responsePending = false;
  
  constructor(players: BiddingPlayersRound, hero: Hero, monsters: Monster[]) {
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

    this.responsePending = true;

    if (action === 'add-monster') {

      const content = this.pickCurrentMonster();
      return { action, player, content };

    } else if (action === 'remove-equipment') {

      const content = this.getRemovableEquipment();
      return { action, player, content };

    } else {
      return { action, player };
    }
  }

  public getResult(): RaidParticipants {
    if (!this.hasEnded) throw new Error ('Bidding phase has not ended yet.');
  
    return {
      raider: this.players.getRaider(),
      hero: this.hero,
      enemies: this.monstersInDungeon
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

    this.monstersInDungeon.push(this.pickedMonster);
    this.pickedMonster = undefined;
  }

  private endTurn(): Player {
    const nextPlayer = this.players.advanceToNextPlayer();
    this.currentAction = 'play-bidding';  

    return nextPlayer;
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
      if (this.getRemovableEquipment().length === 0) {
        const message = 'necessarily-add-monster';
        const entity = this.pickCurrentMonster();
        this.addPickedMonsterToDungeon();
        
        if (this.monstersPack.length === 0) {
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
        } else {
          const nextPlayer = this.endTurn();
          const lastMonster = this.monstersPack.length === 1;

          notification = {
            target, 
            message, 
            entity,
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

    const pickedMonster = this.monstersPack.pop() as Monster;
    this.pickedMonster = pickedMonster;

    return pickedMonster.type;
  }
}
