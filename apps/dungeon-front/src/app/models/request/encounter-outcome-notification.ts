import { HasTarget, TargetedRequest } from './request';
import { EncounterOutcome } from '../models';

type EncounterOutcomeNotificationContent = HasTarget & EncounterOutcome;

export type EncounterOutcomeNotification =
  TargetedRequest<boolean, EncounterOutcomeNotificationContent>;
