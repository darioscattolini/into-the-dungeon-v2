import { Request } from './request';
import { BiddingEndReason } from '../models';

interface BiddingEndNotificationContent {
  endReason: BiddingEndReason;
  raider: string
}

export type BiddingEndNotification 
  = Request<boolean, BiddingEndNotificationContent>;
