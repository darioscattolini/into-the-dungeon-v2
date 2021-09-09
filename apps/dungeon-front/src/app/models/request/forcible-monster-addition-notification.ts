import { HasTarget, TargetedRequest } from './request';
import { MonsterViewData, MonsterType } from '../models';

interface ForcibleMonsterAdditionNotificationContent extends HasTarget {
  monster: MonsterViewData<MonsterType>;
}

export type ForcibleMonsterAdditionNotification =
  TargetedRequest<boolean, ForcibleMonsterAdditionNotificationContent>;
