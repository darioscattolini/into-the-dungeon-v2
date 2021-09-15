import { Request } from './request';
import { RoundResult } from '../models';

export type RoundResultNotification = Request<boolean, RoundResult>;
