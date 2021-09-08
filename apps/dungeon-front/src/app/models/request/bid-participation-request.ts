import { Request } from './request';
import { BiddingStateViewData } from '../models';

export class BidParticipationRequest extends Request<boolean> {
  public readonly player: string;
  public readonly state: BiddingStateViewData;

  constructor(player: string, state: BiddingStateViewData) {
    super();
    this.player = player;
    this.state = state;
  }
}
