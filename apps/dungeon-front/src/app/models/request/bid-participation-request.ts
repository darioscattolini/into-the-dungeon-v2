import { BidParticipationRequestData } from '../models';
import { Request } from './request';

export class BidParticipationRequest extends Request<boolean> {
  public readonly state: BidParticipationRequestData['state'];

  constructor(player: string, state: BidParticipationRequestData['state']) {
    super(player);
    this.state = state;
  }
}
