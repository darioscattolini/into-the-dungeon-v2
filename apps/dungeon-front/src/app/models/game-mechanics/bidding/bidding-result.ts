import { RaidParticipants } from '../../models';

export type BiddingEndReason = 'last-bidding-player' | 'no-monsters';

export interface BiddingResult extends RaidParticipants {
  endReason: BiddingEndReason;
}
