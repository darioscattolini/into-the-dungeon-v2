import { Injectable } from '@angular/core';
import { UiMediatorService } from './ui-mediator.service';
import { Player, PlayerRequirements } from '../../models/models';

@Injectable()
export class PlayersService {
  
  constructor(private uiMediator: UiMediatorService) { }

  public async getJoiningPlayers(
    requirements: PlayerRequirements
  ): Promise<Player[]> {
    const range: [number, number] = [requirements.min, requirements.max];
    const amount = await this.uiMediator.requestPlayersAmount(range);

    if (amount < range[0] || amount > range[1]) {
      throw new Error('Amount of players out of expected range');
    }

    const joiningPlayers: Player[] = [];

    for (let i = 0; i < amount; i++) {
      const name = await this.requestName(joiningPlayers);
      const player = new Player(name);
      joiningPlayers.push(player);
    }

    return joiningPlayers;
  }

  private async requestName(players: Player[], error?: string): Promise<string> {
    if (error) {
      this.uiMediator.notifyError(error);
    }
    
    let name = await this.uiMediator.requestPlayerName();

    error = this.checkForRepeatedNames(players, name).error;

    if (error) {
      name = await this.requestName(players, error);
    }
  
    return name;
  }

  private checkForRepeatedNames(
    joiningPlayers: Player[], name: string
  ): { error?: string } {
    for (const player of joiningPlayers) {
      if (player.name.toLowerCase() === name.toLowerCase()) {
        return { error: `There can only be one player named ${name}` };
      }
    }

    return {}
  }
}
