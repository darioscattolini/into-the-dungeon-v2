import { Player } from '../models';

interface PlayerPoints {
  player: Player;
  successfulRaids: number;
  failedRaids: number;
}

export interface RoundResult {
  points: PlayerPoints[]
  winner?: Player;
}
