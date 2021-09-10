import {
  Player,
  PlayerRequirements,
  BiddingPlayersRound,
  RaidResult
} from '../models';

interface RoundResult {
  outOfGame?: Player;
}

type RaidResultTracker = [Player[], Player[], Player[]];

export class Game {
  private static readonly minPlayers = 2;
  private static readonly maxPlayers = 4;

  private lastRaider: Player | undefined;
  private orderedPlayers: Readonly<Player[]>;
  private raidSuccessTracker: RaidResultTracker = [[], [], []];
  private raidFailureTracker: RaidResultTracker = [[], [], []];
  
  constructor(players: Player[]) {
    this.validatePlayersAmount(players);
    this.orderedPlayers = Object.freeze(players);
    this.startTrackers();
  }

  public static getPlayerRequirements(): PlayerRequirements {
    return {
      min: this.minPlayers,
      max: this.maxPlayers
    }
  }

  public endRound(raidResult: RaidResult): RoundResult {
    if (this.getWinner()) {
      throw new Error('Unexpected call: game should have ended');
    }

    const player = raidResult.raider;
    
    if (raidResult.survived) this.addRaidSuccess(player);
    else this.addRaidFailure(player);

    const outOfGame = this.getRaidFailures(player) >= 2;

    this.lastRaider = player;

    return outOfGame ? { outOfGame: player } : {};
  }

  public getBiddingPlayersRound(): BiddingPlayersRound {
    if (this.getWinner()) {
      throw new Error('Unexpected call: game should have ended');
    }

    const activePlayers = this.getActivePlayers();
    let randomStarter: number;
    
    if (!this.lastRaider || !activePlayers.includes(this.lastRaider)) {
      randomStarter = Math.floor(Math.random() * activePlayers.length);
    } else {
      randomStarter = activePlayers.indexOf(this.lastRaider);
    }

    return new BiddingPlayersRound(activePlayers, randomStarter);
  }

  public getWinner(): Player | undefined {
    let winner: Player | undefined;

    winner = this.getTwiceSuccessfulRaider();
    
    if (!winner) winner = this.getLastSurvivingPlayer();

    return winner;
  }

  private addRaidFailure(player: Player): void {
    const failures = this.getRaidFailures(player);

    if (failures >= 2) {
      throw new Error(`${player.name} had lost, should not have been raider`);
    }
    
    const indexToRemove = this.raidFailureTracker[failures].indexOf(player);

    this.raidFailureTracker[failures].splice(indexToRemove, 1);
    this.raidFailureTracker[failures + 1].push(player);
  }

  private addRaidSuccess(player: Player): void {
    const successes = this.getRaidSuccesses(player);
    
    const indexToRemove = this.raidSuccessTracker[successes].indexOf(player);

    this.raidSuccessTracker[successes].splice(indexToRemove, 1);
    this.raidSuccessTracker[successes + 1].push(player);
  }

  private getTwiceSuccessfulRaider(): Player | undefined {
    let player: Player | undefined;

    if (this.raidSuccessTracker[2].length === 1) {
      [player] = this.raidSuccessTracker[2];
    }

    return player;
  }

  private getActivePlayers(): Player[] {
    return this.orderedPlayers
      .filter(player => this.getRaidFailures(player) < 2);
  }

  private getLastSurvivingPlayer(): Player | undefined {
    let player: Player | undefined;

    const activePlayers = this.getActivePlayers();

    if (activePlayers.length === 1) {
      [player] = activePlayers;
    }

    return player;
  }

  private getRaidFailures(player: Player): number {
    return this.raidFailureTracker
      .findIndex(position => position.includes(player));
  }

  private getRaidSuccesses(player: Player): number {
    return this.raidSuccessTracker
      .findIndex(position => position.includes(player));
  }

  private startTrackers(): void {
    for (const player of this.orderedPlayers) {
      this.raidFailureTracker[0].push(player);
      this.raidSuccessTracker[0].push(player);
    }
  }

  private validatePlayersAmount(players: Player[]): void {
    const min = Game.minPlayers;
    const max = Game.maxPlayers;

    if (players.length < min || players.length > max) {
      throw new Error(`Game must be created with ${min}-${max} players`);
    }
  }
}
