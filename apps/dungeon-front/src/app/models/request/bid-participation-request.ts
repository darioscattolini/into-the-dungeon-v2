import { Request } from './request';
import { BiddingStateViewData } from '../models';

export class BidParticipationRequest extends Request<boolean> {
  public readonly state: BiddingStateViewData;

  constructor(player: string, state: BiddingStateViewData) {
    super(player);
    this.state = state;
  }
}
